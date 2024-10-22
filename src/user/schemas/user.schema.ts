import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ versionKey: false, timestamps: true })
export class User {
  _id: Types.ObjectId

  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  createdAt: Date

  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
