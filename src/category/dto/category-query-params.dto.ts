import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformBooleanStringToBoolean } from '../../common/decorators/transform-boolean-string-to-boolean.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'
import { CategoryType } from '../category.types'

export class CategoryQueryParamsDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType

  @IsOptional()
  @TransformBooleanStringToBoolean()
  @IsBoolean()
  isArchived?: boolean
}
