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

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'
import { TransferTargetDto } from './transfer-target.dto'

export class CreateTransferDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
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
