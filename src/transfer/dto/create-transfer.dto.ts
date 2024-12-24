import { Type } from 'class-transformer'
import {
  IsDate,
  IsNegative,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Types } from 'mongoose'

import { IsValidAmount } from '../../common/decorators/is-valid-amount.decorator'
import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'
import { IsValidExchangeRate } from '../decorators/is-valid-exchange-rate.decorator'

class FromTransferTargetDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  accountId: Types.ObjectId

  @IsValidAmount()
  @IsNegative()
  amount: number
}

class ToTransferTargetDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  accountId: Types.ObjectId

  @IsValidAmount()
  @IsPositive()
  amount: number
}

export class CreateTransferDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @ValidateNested()
  @Type(() => FromTransferTargetDto)
  from: FromTransferTargetDto

  @ValidateNested()
  @Type(() => ToTransferTargetDto)
  to: ToTransferTargetDto

  @IsValidExchangeRate()
  exchangeRate: number

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
