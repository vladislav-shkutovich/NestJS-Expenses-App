import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { BASE_CURRENCY } from '../common/constants/currency.constants'
import { ServiceUnavailableError } from '../common/errors/errors'
import { toISODate } from '../common/utils/formatting.utils'
import { CurrencyService } from '../currency/currency.service'
import { ExchangeRateQueryParamsDto } from './dto/exchange-rate-query-params.dto'
import { ExchangeRateDatabaseService } from './exchange-rate.database.service'
import type { CreateExchangeRateContent } from './exchange-rate.types'
import { NbrbApiService } from './nbrb-api.service'
import type { ExchangeRate } from './schemas/exchange-rate.schema'

@Injectable()
export class ExchangeRateService implements OnApplicationBootstrap {
  private readonly sourceOnBootstrap =
    'Missing exchange rates from the NBRB API on application bootstrap'
  private readonly sourceOnCronJob =
    'Daily exchange rates from NBRB API at UTC 11:00:00'

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly exchangeRateDatabaseService: ExchangeRateDatabaseService,
    private readonly nbrbApiService: NbrbApiService,
  ) {}

  async onApplicationBootstrap() {
    await this.insertMissingRatesUpToCurrentDate(this.sourceOnBootstrap)
  }

  @Cron(CronExpression.EVERY_DAY_AT_2PM)
  async handleDailyExchangeRates() {
    await this.insertMissingRatesUpToCurrentDate(this.sourceOnCronJob)
  }

  async getExchangeRates(
    options: ExchangeRateQueryParamsDto,
  ): Promise<ExchangeRate[]> {
    return await this.exchangeRateDatabaseService.getExchangeRates(options)
  }

  private async insertMissingRatesUpToCurrentDate(
    source: string,
  ): Promise<void> {
    console.debug(`Checking for: ${source}...`)

    const currentDate = new Date()
    const latestDate = await this.exchangeRateDatabaseService.getLatestValidTo()

    if (latestDate > currentDate) {
      console.debug('Exchange rates are up to date.')
      return
    }

    const dateRange = this.getISODateRange(latestDate, currentDate)

    const ratesOnDateRange = await this.processRatesOnDateRange(
      dateRange,
      source,
    )

    const insertedRatesCount =
      await this.exchangeRateDatabaseService.insertExchangeRates(
        ratesOnDateRange,
      )

    console.debug(`Inserted ${insertedRatesCount} exchange rate records.`)
  }

  private getISODateRange(dateFrom: Date, dateTo: Date) {
    const nextDate = new Date(dateFrom)
    const dateArray: string[] = []

    while (nextDate <= dateTo) {
      dateArray.push(toISODate(nextDate))
      nextDate.setDate(nextDate.getDate() + 1)
    }

    return dateArray
  }

  private async processRatesOnDateRange(
    dateRange: string[],
    source: string,
  ): Promise<CreateExchangeRateContent[]> {
    const currencies = await this.currencyService.getCurrencies({})
    const ratesOnDateRange: CreateExchangeRateContent[] = []

    await Promise.all(
      dateRange.map(async (date) => {
        try {
          console.debug(`Processing date: ${date}...`)

          const ratesOnDate = await this.nbrbApiService.fetchRatesOnDate(date)

          const ratesOnDateByCurrencies = ratesOnDate.filter((rate) =>
            currencies.some(
              (currency) => currency.code === rate.Cur_Abbreviation,
            ),
          )

          const validFrom = new Date(`${date}T11:00:00`)
          const validTo = new Date(`${date}T10:59:59.999`)
          validTo.setDate(validTo.getDate() + 1)

          ratesOnDateRange.push(
            ...ratesOnDateByCurrencies.map((rate) => ({
              baseCurrency: BASE_CURRENCY,
              targetCurrency: rate.Cur_Abbreviation,
              validFrom,
              validTo,
              rate: rate.Cur_OfficialRate,
              source,
              scale: rate.Cur_Scale,
            })),
          )
        } catch (error) {
          throw new ServiceUnavailableError(
            `Error processing exchange rates on date ${date}`,
          )
        }
      }),
    )

    return ratesOnDateRange
  }
}
