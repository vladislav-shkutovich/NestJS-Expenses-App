import { Type } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator'
import { Types } from 'mongoose'

import { IsValidAmount } from '../../common/decorators/is-valid-amount.decorator'
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

  @IsValidAmount()
  @NotEquals(0)
  amount: number

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
