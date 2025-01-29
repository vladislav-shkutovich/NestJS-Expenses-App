import { Injectable, OnApplicationBootstrap } from '@nestjs/common'

import { BASE_CURRENCY } from '../common/constants/currency.constants'
import { toISODate } from '../common/utils/formatting.utils'
import { CurrencyService } from '../currency/currency.service'
import { ExchangeRateQueryParamsDto } from './dto/exchange-rate-query-params.dto'
import { ExchangeRateDatabaseService } from './exchange-rate.database.service'
import type {
  CreateExchangeRateContent,
  NbrbApiRate,
} from './exchange-rate.types'
import { ExchangeRate } from './schemas/exchange-rate.schema'

@Injectable()
export class ExchangeRateService implements OnApplicationBootstrap {
  private readonly currentDate = new Date()
  private readonly sourceForMissingRates =
    'NBRB API: Filling missing exchange rates on application bootstrap'

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly exchangeRateDatabaseService: ExchangeRateDatabaseService,
  ) {}

  private getDateStringRange(dateFrom: Date, dateTo: Date) {
    const dateArray: string[] = []
    const nextDate = new Date(dateFrom)

    while (nextDate <= dateTo) {
      dateArray.push(toISODate(nextDate))
      nextDate.setDate(nextDate.getDate() + 1)
    }

    return dateArray
  }

  // TODO: - Refactor: move everything related to NBRB API outside of ExchangeRateService;
  private async fetchRatesOnDate(date: string): Promise<NbrbApiRate[]> {
    // Check docs at https://www.nbrb.by/apihelp/exrates for periodicity
    const dayPeriodicity = 0
    const monthPeriodicity = 1

    const [dayPeriodicityRatesResponse, monthPeriodicityRatesResponse] =
      await Promise.all([
        fetch(
          `https://api.nbrb.by/exrates/rates?periodicity=${dayPeriodicity}&ondate=${date}`,
        ),
        fetch(
          `https://api.nbrb.by/exrates/rates?periodicity=${monthPeriodicity}&ondate=${date}`,
        ),
      ])

    if (!dayPeriodicityRatesResponse.ok || !monthPeriodicityRatesResponse.ok) {
      // todo: handle errors
      throw new Error(
        `Failed to fetch rates for date: ${date} from api.nbrb.by`,
      )
    }

    const [dayPeriodicityRates, monthPeriodicityRates] = await Promise.all([
      dayPeriodicityRatesResponse.json() as Promise<NbrbApiRate[]>,
      monthPeriodicityRatesResponse.json() as Promise<NbrbApiRate[]>,
    ])

    const rates: NbrbApiRate[] = [
      ...dayPeriodicityRates,
      ...monthPeriodicityRates,
    ]

    return rates
  }

  async onApplicationBootstrap() {
    const latestValidToDate =
      await this.exchangeRateDatabaseService.getLatestValidTo()

    if (latestValidToDate > this.currentDate) {
      console.debug('Exchange rates is up to date.')
      return
    }

    console.debug(
      `Exchange rates from ${toISODate(latestValidToDate)} to ${toISODate(this.currentDate)} is missing`,
    )

    const currencies = await this.currencyService.getCurrencies({})
    const ratesOnDateRange: CreateExchangeRateContent[] = []
    const dateRange = this.getDateStringRange(
      latestValidToDate,
      this.currentDate,
    )

    await Promise.all(
      dateRange.map(async (date) => {
        try {
          console.debug(`Processing date: ${date}...`)

          const ratesOnDate = await this.fetchRatesOnDate(date)
          const ratesOnDateByCurrencies = ratesOnDate.filter((rate) =>
            currencies.some(
              (currency) => currency.code === rate.Cur_Abbreviation,
            ),
          )

          const validFrom = new Date(`${date}T14:00:00`)
          const validTo = new Date(`${date}T13:59:59.999`)
          validTo.setDate(validTo.getDate() + 1)

          ratesOnDateRange.push(
            ...ratesOnDateByCurrencies.map((rate) => ({
              baseCurrency: BASE_CURRENCY,
              targetCurrency: rate.Cur_Abbreviation,
              validFrom,
              validTo,
              rate: rate.Cur_OfficialRate,
              source: this.sourceForMissingRates,
              scale: rate.Cur_Scale,
            })),
          )
        } catch (error) {
          // todo: handle errors
          throw new Error(`Error processing date ${date}`)
        }
      }),
    )

    await this.exchangeRateDatabaseService.insertExchangeRates(ratesOnDateRange)
    console.debug(`Inserted ${ratesOnDateRange.length} exchange rate records.`)
  }

  async getExchangeRates(
    options: ExchangeRateQueryParamsDto,
  ): Promise<ExchangeRate[]> {
    return await this.exchangeRateDatabaseService.getExchangeRates(options)
  }
}
