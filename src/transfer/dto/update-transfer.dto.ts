import { Type } from 'class-transformer'
import {
  IsDate,
  IsNegative,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'

class FromTransferTargetDto {
  @IsNumber()
  @IsNegative()
  @IsOptional()
  amount?: number
}

class ToTransferTargetDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number
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

  @IsNumber()
  @IsPositive()
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
