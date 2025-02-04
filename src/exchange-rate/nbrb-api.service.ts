import { Injectable } from '@nestjs/common'

import { BASE_CURRENCY } from '../common/constants/currency.constants'
import { ServiceUnavailableError } from '../common/errors/errors'
import { ExchangeRateAdapter } from './exchange-rate.adapter'
import { CreateExchangeRateContent } from './exchange-rate.types'
import type { NbrbApiRate } from './nbrb-api.types'

@Injectable()
export class NbrbApiService implements ExchangeRateAdapter {
  private readonly NBRB_API_URL = 'https://api.nbrb.by/exrates/rates'
  // For periodicity params check docs at https://www.nbrb.by/apihelp/exrates
  private readonly PERIODICITY_DAY = 0
  private readonly PERIODICITY_MONTH = 1
  private readonly VALIDITY_START_TIME = 'T11:00:00'
  private readonly VALIDITY_END_TIME = 'T10:59:59.999'

  async fetchRatesOnDate(
    date: string,
    source: string,
  ): Promise<CreateExchangeRateContent[]> {
    try {
      const [dayRatesResponse, monthRatesResponse] = await Promise.all([
        fetch(
          `${this.NBRB_API_URL}?periodicity=${this.PERIODICITY_DAY}&ondate=${date}`,
        ),
        fetch(
          `${this.NBRB_API_URL}?periodicity=${this.PERIODICITY_MONTH}&ondate=${date}`,
        ),
      ])

      const errors: string[] = []
      if (!dayRatesResponse.ok) {
        errors.push(
          `Day rates: ${dayRatesResponse.status} ${dayRatesResponse.statusText}`,
        )
      }
      if (!monthRatesResponse.ok) {
        errors.push(
          `Month rates: ${monthRatesResponse.status} ${monthRatesResponse.statusText}`,
        )
      }

      if (errors.length > 0) {
        throw new ServiceUnavailableError(errors.join(', '))
      }

      const [dayRates, monthRates] = await Promise.all([
        dayRatesResponse.json() as Promise<NbrbApiRate[]>,
        monthRatesResponse.json() as Promise<NbrbApiRate[]>,
      ])

      const validFrom = new Date(`${date}${this.VALIDITY_START_TIME}`)
      const validTo = new Date(`${date}${this.VALIDITY_END_TIME}`)

      validTo.setDate(validTo.getDate() + 1)

      return [...dayRates, ...monthRates].map((rate) => ({
        baseCurrency: BASE_CURRENCY,
        targetCurrency: rate.Cur_Abbreviation,
        validFrom,
        validTo,
        rate: rate.Cur_OfficialRate,
        source,
        scale: rate.Cur_Scale,
      }))
    } catch (error) {
      throw new ServiceUnavailableError(
        `Failed to fetch exchange rates for date ${date} from NBRB API.`,
        { cause: error },
      )
    }
  }
}
