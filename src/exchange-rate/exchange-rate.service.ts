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
  private readonly SOURCE_ON_BOOTSTRAP =
    'Missing exchange rates on application bootstrap'
  private readonly SOURCE_ON_CRON = 'Daily exchange rates at UTC 11:00:00'
  private readonly VALIDITY_START_TIME = 'T11:00:00'
  private readonly VALIDITY_END_TIME = 'T10:59:59.999'

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly exchangeRateDatabaseService: ExchangeRateDatabaseService,
    private readonly nbrbApiService: NbrbApiService,
  ) {}

  async onApplicationBootstrap() {
    await this.insertMissingRatesUpToCurrentDate(this.SOURCE_ON_BOOTSTRAP)
  }

  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async handleDailyExchangeRates() {
    await this.insertMissingRatesUpToCurrentDate(this.SOURCE_ON_CRON)
  }

  async getExchangeRatesOnDate(
    options: ExchangeRateQueryParamsDto,
  ): Promise<ExchangeRate[]> {
    return await this.exchangeRateDatabaseService.getExchangeRatesOnDate(
      options,
    )
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

          const validFrom = new Date(`${date}${this.VALIDITY_START_TIME}`)
          const validTo = new Date(`${date}${this.VALIDITY_END_TIME}`)

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
