import { Types } from 'mongoose'

export type SummaryOnAccountCreateParams = {
  accountId: Types.ObjectId
  currencyCode: string
  createdAt: Date
}

export type SummaryOnTransactionCreateDeleteParams = {
  accountId: Types.ObjectId
  currencyCode: string
  date: Date
  amount: number
}

export type SummaryOnTransactionUpdateParams = {
  accountId: Types.ObjectId
  currencyCode: string
  prevDate: Date
  nextDate: Date
  prevAmount: number
  nextAmount: number
}
