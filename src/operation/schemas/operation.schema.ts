import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import {
  ACCOUNT_MODEL,
  CATEGORY_MODEL,
  USER_MODEL,
} from '../../common/constants/database.constants'

@Schema({ versionKey: false, timestamps: true })
export class Operation {
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: ACCOUNT_MODEL, required: true })
  accountId: Types.ObjectId

  @Prop({ required: true })
  currencyCode: string // Currency.code ref

  @Prop({ type: Types.ObjectId, ref: CATEGORY_MODEL, required: true })
  categoryId: Types.ObjectId

  @Prop({ required: true })
  amount: number

  @Prop({ type: Date, required: true })
  date: Date

  @Prop()
  description?: string

  createdAt: Date

  updatedAt: Date
}

export const OperationSchema = SchemaFactory.createForClass(Operation)
