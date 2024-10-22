import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import {
  CURRENCY_MODEL,
  USER_MODEL,
} from '../../common/constants/database.constants'
import { AccountType } from '../account.types'

@Schema({ versionKey: false, timestamps: true })
export class Account {
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId

  @Prop({ ref: CURRENCY_MODEL, required: true })
  currencyCode: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: AccountType, type: String })
  accountType: AccountType

  @Prop({ required: true, default: false })
  isSavings: boolean

  @Prop({ required: true, default: 0 })
  balance: number

  createdAt: Date

  updatedAt: Date
}

export const AccountSchema = SchemaFactory.createForClass(Account)
