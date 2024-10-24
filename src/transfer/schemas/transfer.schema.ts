import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { USER_MODEL } from '../../common/constants/database.constants'
import { TransferTarget, TransferTargetSchema } from './transfer-target.schema'

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
