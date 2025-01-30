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

      if (!dayRatesResponse.ok || !monthRatesResponse.ok) {
        throw new ServiceUnavailableError(
          `Failed to fetch exchange rates for date ${date} from NBRB API`,
        )
      }

      const [dayRates, monthRates] = await Promise.all([
        dayRatesResponse.json() as Promise<NbrbApiRate[]>,
        monthRatesResponse.json() as Promise<NbrbApiRate[]>,
      ])

      return [...dayRates, ...monthRates]
    } catch (error) {
      throw new ServiceUnavailableError(
        `Something went wrong while getting exchange rates for date ${date} from NBRB API`,
      )
    }
  }
}
