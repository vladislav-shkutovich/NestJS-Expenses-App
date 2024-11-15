import { Type } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'
import { TransferTargetDto } from './transfer-target.dto'

export class CreateTransferDto {
  @TransformToValidObjectId()
  userId: Types.ObjectId

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
  @Type(() => Date)
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
