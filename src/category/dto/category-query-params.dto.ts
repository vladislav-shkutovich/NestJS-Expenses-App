import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { CategoryType } from '../category.types'

export class CategoryQueryParamsDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId

  @IsOptional()
  @IsEnum(CategoryType)
  type: CategoryType

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isArchived?: boolean
}
