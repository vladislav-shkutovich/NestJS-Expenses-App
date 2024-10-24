import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Totals, TotalsSchema } from './totals.schema'

@Schema({ _id: false })
export class CurrencyEntry {
  @Prop({ type: TotalsSchema, required: true })
  totals: Totals

  @Prop({ type: TotalsSchema, required: true })
  convertedTotals: Totals
}

export const CurrencyEntrySchema = SchemaFactory.createForClass(CurrencyEntry)
