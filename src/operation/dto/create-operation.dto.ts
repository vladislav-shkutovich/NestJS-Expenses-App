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

export class CreateOperationDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @TransformStringToObjectId()
  @IsValidObjectId()
  accountId: Types.ObjectId

  @TransformStringToObjectId()
  @IsValidObjectId()
  categoryId: Types.ObjectId

  @IsNumber()
  amount: number

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
