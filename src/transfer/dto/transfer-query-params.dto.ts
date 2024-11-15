import { Type } from 'class-transformer'
import { IsDate, IsISO4217CurrencyCode, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'

export class TransferQueryParamsDto {
  @TransformToValidObjectId()
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
  @TransformToValidObjectId()
  fromAccountId?: Types.ObjectId

  @IsOptional()
  @TransformToValidObjectId()
  toAccountId?: Types.ObjectId

  @IsOptional()
  @IsISO4217CurrencyCode()
  fromCurrencyCode?: string

  @IsOptional()
  @IsISO4217CurrencyCode()
  toCurrencyCode?: string
}
