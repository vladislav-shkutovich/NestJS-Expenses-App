import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { USER_MODEL } from '../../common/constants/database.constants'

@Schema({ _id: false })
export class Totals {
  @Prop({ required: true })
  startingBalance: number

  @Prop({ required: true })
  endingBalance: number

  @Prop({ required: true })
  totalIncome: number

  @Prop({ required: true })
  totalExpense: number
}

const TotalsSchema = SchemaFactory.createForClass(Totals)

@Schema({ _id: false })
export class AccountEntry {
  @Prop({ type: TotalsSchema, required: true })
  totals: Totals
}

export const AccountEntrySchema = SchemaFactory.createForClass(AccountEntry)

@Schema({ _id: false })
export class CurrencyEntry {
  @Prop({ type: TotalsSchema, required: true })
  totals: Totals

  @Prop({ type: TotalsSchema, required: true })
  convertedTotals: Totals
}

const CurrencyEntrySchema = SchemaFactory.createForClass(CurrencyEntry)

@Schema({ versionKey: false, timestamps: true })
export class Summary {
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId

  @Prop({ type: Date, required: true })
  dateFrom: Date

  @Prop({ type: Date, required: true })
  dateTo: Date

  @Prop({ type: Map, of: AccountEntrySchema, required: true })
  accounts: Map<string, AccountEntry>

  @Prop({ type: Map, of: CurrencyEntrySchema, required: true })
  currencies: Map<string, CurrencyEntry>

  createdAt: Date

  updatedAt: Date
}

export const SummarySchema = SchemaFactory.createForClass(Summary)
