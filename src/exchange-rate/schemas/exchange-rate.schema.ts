import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

// TODO: - Rework ExchangeRate schema to handle all necessary rates per day in one document;
@Schema({ versionKey: false, timestamps: true })
export class ExchangeRate {
  _id: Types.ObjectId

  @Prop({ required: true, default: 'BYN' })
  baseCurrency: string // Currency.code ref

  @Prop({ required: true })
  targetCurrency: string // Currency.code ref

  @Prop({ type: Date, required: true })
  validFrom: Date

  @Prop({ type: Date, required: true })
  validTo: Date

  @Prop({ required: true })
  rate: number

  @Prop()
  source?: string

  @Prop({ required: true })
  scale: number

  createdAt: Date

  updatedAt: Date
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate)
