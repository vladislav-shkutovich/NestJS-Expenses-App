import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { TransformToBoolean } from '../../common/decorators/transform-to-boolean.decorator'
import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'
import { CategoryType } from '../category.types'

export class CategoryQueryParamsDto {
  @TransformToValidObjectId()
  userId: Types.ObjectId

  @IsOptional()
  @IsEnum(CategoryType)
  type: CategoryType

  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isArchived?: boolean
}
