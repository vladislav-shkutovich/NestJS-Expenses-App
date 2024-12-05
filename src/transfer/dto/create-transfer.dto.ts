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
import { IsValidTransferAmounts } from '../decorators/is-valid-create-transfer-amounts.decorator'
import {
  FromTransferTargetDto,
  ToTransferTargetDto,
} from './transfer-target.dto'

export class CreateTransferDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @IsValidTransferAmounts()
  @ValidateNested()
  @Type(() => FromTransferTargetDto)
  from: FromTransferTargetDto

  @ValidateNested()
  @Type(() => ToTransferTargetDto)
  to: ToTransferTargetDto

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
