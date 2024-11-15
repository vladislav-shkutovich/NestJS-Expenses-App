import { Type } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'

export class CreateOperationDto {
  @TransformToValidObjectId()
  userId: Types.ObjectId

  @TransformToValidObjectId()
  accountId: Types.ObjectId

  @TransformToValidObjectId()
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
