import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'
import { CategoryType } from '../category.types'
export class CreateCategoryDto {
  @TransformToValidObjectId()
  userId: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(CategoryType)
  type: CategoryType

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean
}
