import { Type } from 'class-transformer'
import { IsDate, IsISO4217CurrencyCode, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'

export class TransferQueryParamsDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date

  @IsOptional()
  @TransformStringToObjectId()
  @IsValidObjectId()
  fromAccountId?: Types.ObjectId

  @IsOptional()
  @TransformStringToObjectId()
  @IsValidObjectId()
  toAccountId?: Types.ObjectId

  @IsOptional()
  @IsISO4217CurrencyCode()
  fromCurrencyCode?: string

  @IsOptional()
  @IsISO4217CurrencyCode()
  toCurrencyCode?: string
}
