import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

import { TransferTargetDto } from './transfer-target.dto'

export class CreateTransferDto {
  @ValidateNested()
  @Type(() => TransferTargetDto)
  from: TransferTargetDto

  @ValidateNested()
  @Type(() => TransferTargetDto)
  to: TransferTargetDto

  @IsNumber()
  @IsPositive()
  exchangeRate: number

  @IsDate()
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
