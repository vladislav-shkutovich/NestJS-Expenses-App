import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ versionKey: false })
export class Currency {
  _id: Types.ObjectId

  @Prop({ required: true, unique: true })
  code: string

  @Prop({ required: true })
  name: string
}

export const CurrencySchema = SchemaFactory.createForClass(Currency)
