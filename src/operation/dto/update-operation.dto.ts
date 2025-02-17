import { Type } from 'class-transformer'
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'

export class UpdateOperationDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  @IsOptional()
  categoryId?: Types.ObjectId

  @IsInt()
  @NotEquals(0)
  @IsOptional()
  amount?: number

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
