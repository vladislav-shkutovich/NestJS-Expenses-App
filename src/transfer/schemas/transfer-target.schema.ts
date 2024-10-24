import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { ACCOUNT_MODEL } from '../../common/constants/database.constants'

@Schema({ _id: false })
export class TransferTarget {
  @Prop({ type: Types.ObjectId, ref: ACCOUNT_MODEL, required: true })
  accountId: Types.ObjectId

  @Prop({ required: true })
  currencyCode: string // Currency.code ref

  @Prop({ required: true })
  amount: number
}

export const TransferTargetSchema = SchemaFactory.createForClass(TransferTarget)
