import type { ExchangeRate } from './schemas/exchange-rate.schema'

export type NbrbApiRate = {
  Cur_ID: number
  Date: string
  Cur_Abbreviation: string
  Cur_Scale: number
  Cur_Name: string
  Cur_OfficialRate: number
}

export type CreateExchangeRateContent = Omit<
  ExchangeRate,
  '_id' | 'createdAt' | 'updatedAt'
>
