import { Injectable } from '@nestjs/common'

import { ServiceUnavailableError } from '../common/errors/errors'
import type { NbrbApiRate } from './nbrb-api.types'

@Injectable()
export class NbrbApiService {
  private readonly NBRB_API_URL = 'https://api.nbrb.by/exrates/rates'
  // For periodicity params check docs at https://www.nbrb.by/apihelp/exrates
  private readonly PERIODICITY_DAY = 0
  private readonly PERIODICITY_MONTH = 1

  async fetchRatesOnDate(date: string): Promise<NbrbApiRate[]> {
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

      return [...dayRates, ...monthRates]
    } catch (error) {
      throw new ServiceUnavailableError(
        `Failed to fetch exchange rates for date ${date} from NBRB API.`,
        { cause: error },
      )
    }
  }
}
