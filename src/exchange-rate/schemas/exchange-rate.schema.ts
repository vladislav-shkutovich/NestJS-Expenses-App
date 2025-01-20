import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { BASE_CURRENCY } from '../../common/constants/currency.constants'

@Schema({ _id: false })
class RateEntry {
  @Prop({ required: true })
  rate: number

  @Prop({ required: true, isInteger: true })
  scale: number
}

const RateEntrySchema = SchemaFactory.createForClass(RateEntry)

@Schema({ versionKey: false, timestamps: true })
export class ExchangeRate {
  _id: Types.ObjectId

  @Prop({ required: true, default: BASE_CURRENCY })
  baseCurrency: string // Currency.code ref

  @Prop({ required: true, default: 'National Bank of the Republic of Belarus' })
  source: string

  @Prop({ type: Date, required: true })
  validFrom: Date

  @Prop({ type: Date, required: true })
  validTo: Date

  @Prop({ type: Map, of: RateEntrySchema, required: true })
  rates: Map<string, RateEntry>

  createdAt: Date

  updatedAt: Date
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate)
