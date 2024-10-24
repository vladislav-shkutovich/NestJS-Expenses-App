import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Totals, TotalsSchema } from './totals.schema'

@Schema({ _id: false })
export class AccountEntry {
  @Prop({ type: TotalsSchema, required: true })
  totals: Totals
}

export const AccountEntrySchema = SchemaFactory.createForClass(AccountEntry)
