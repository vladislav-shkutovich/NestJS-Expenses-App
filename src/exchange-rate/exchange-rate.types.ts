import type { ExchangeRate } from './schemas/exchange-rate.schema'

export type CreateExchangeRateContent = Omit<
  ExchangeRate,
  '_id' | 'createdAt' | 'updatedAt'
>
