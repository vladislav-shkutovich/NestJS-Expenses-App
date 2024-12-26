import { Type } from 'class-transformer'
import {
  IsDate,
  IsInt,
  IsNegative,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'

import { IsValidExchangeRate } from '../decorators/is-valid-exchange-rate.decorator'

class FromTransferTargetDto {
  @IsInt()
  @IsNegative()
  amount: number
}

class ToTransferTargetDto {
  @IsInt()
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
