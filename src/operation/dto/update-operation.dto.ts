import { Type } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'

export class UpdateOperationDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  @IsOptional()
  categoryId?: Types.ObjectId

  @IsNumber()
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
