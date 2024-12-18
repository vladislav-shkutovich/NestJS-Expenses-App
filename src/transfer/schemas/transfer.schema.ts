import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import {
  ACCOUNT_MODEL,
  USER_MODEL,
} from '../../common/constants/database.constants'

@Schema({ _id: false })
export class TransferTarget {
  @Prop({ type: Types.ObjectId, ref: ACCOUNT_MODEL, required: true })
  accountId: Types.ObjectId

  @Prop({ required: true })
  currencyCode: string // Currency.code ref

  @Prop({ required: true })
  amount: number
}

const TransferTargetSchema = SchemaFactory.createForClass(TransferTarget)

@Schema({ versionKey: false, timestamps: true })
export class Transfer {
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId

  @Prop({ type: TransferTargetSchema, required: true })
  from: TransferTarget

  @Prop({ type: TransferTargetSchema, required: true })
  to: TransferTarget

  @Prop({ required: true })
  exchangeRate: number

  @Prop({ type: Date, required: true })
  date: Date

  @Prop()
  description?: string

  createdAt: Date

  updatedAt: Date
}

export const TransferSchema = SchemaFactory.createForClass(Transfer)
