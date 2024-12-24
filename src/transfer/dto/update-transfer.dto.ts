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

import { IsValidAmount } from '../../common/decorators/is-valid-amount.decorator'
import { IsValidExchangeRate } from '../decorators/is-valid-exchange-rate.decorator'

class FromTransferTargetDto {
  @IsValidAmount()
  @IsNegative()
  amount: number
}

class ToTransferTargetDto {
  @IsValidAmount()
  @IsPositive()
  amount: number
}

export class UpdateTransferDto {
  @ValidateNested()
  @Type(() => FromTransferTargetDto)
  @IsOptional()
  from?: FromTransferTargetDto

  @ValidateNested()
  @Type(() => ToTransferTargetDto)
  @IsOptional()
  to?: ToTransferTargetDto

  @IsValidExchangeRate()
  @IsOptional()
  exchangeRate?: number

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
