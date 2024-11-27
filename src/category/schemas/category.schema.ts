import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { USER_MODEL } from '../../common/constants/database.constants'
import { CategoryType } from '../category.types'

@Schema({ versionKey: false, timestamps: true })
export class Category {
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: CategoryType, type: String })
  type: CategoryType

  @Prop({ required: true, default: false })
  isArchived: boolean

  @Prop({ type: Date })
  archivedAt?: Date

  createdAt: Date

  updatedAt: Date
}

export const CategorySchema = SchemaFactory.createForClass(Category)
