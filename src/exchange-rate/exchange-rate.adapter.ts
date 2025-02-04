import { CreateExchangeRateContent } from './exchange-rate.types'

export interface ExchangeRateAdapter {
  fetchRatesOnDate(
    date: string,
    source: string,
  ): Promise<CreateExchangeRateContent[]>
}
