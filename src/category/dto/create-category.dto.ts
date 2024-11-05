import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

import { CategoryType } from '../category.types'
export class CreateCategoryDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
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
