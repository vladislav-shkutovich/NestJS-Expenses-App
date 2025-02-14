import { Types } from 'mongoose'

export type SummaryOnAccountCreateParams = {
  userId: Types.ObjectId
  accountId: Types.ObjectId
  currencyCode: string
  createdAt: Date
}

export type SummaryOnTransactionCreateDeleteParams = {
  userId: Types.ObjectId
  accountId: Types.ObjectId
  currencyCode: string
  date: Date
  amount: number
}

export type SummaryOnTransactionUpdateParams = {
  userId: Types.ObjectId
  accountId: Types.ObjectId
  currencyCode: string
  prevDate: Date
  nextDate: Date
  prevAmount: number
  nextAmount: number
}
