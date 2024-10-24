import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class Totals {
  @Prop({ required: true })
  startingBalances: number

  @Prop({ required: true })
  endingBalances: number

  @Prop({ required: true })
  totalIncome: number

  @Prop({ required: true })
  totalExpense: number
}

export const TotalsSchema = SchemaFactory.createForClass(Totals)
