import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { USER_MODEL } from '../../common/constants/database.constants'
import { AccountEntry, AccountEntrySchema } from './account-entry.schema'
import { CurrencyEntry, CurrencyEntrySchema } from './currency-entry.schema'

@Schema({ versionKey: false, timestamps: true })
export class Summary {
  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId

  @Prop({ type: Date, required: true })
  from: Date

  @Prop({ type: Date, required: true })
  to: Date

  @Prop({ type: Map, of: AccountEntrySchema, required: true })
  accounts: Map<string, AccountEntry>

  @Prop({ type: Map, of: CurrencyEntrySchema, required: true })
  currencies: Map<string, CurrencyEntry>

  createdAt: Date

  updatedAt: Date
}

export const SummarySchema = SchemaFactory.createForClass(Summary)
