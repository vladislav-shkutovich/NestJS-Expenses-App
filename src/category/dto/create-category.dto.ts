import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'
import { CategoryType } from '../category.types'

export class CreateCategoryDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(CategoryType)
  type: CategoryType
}
