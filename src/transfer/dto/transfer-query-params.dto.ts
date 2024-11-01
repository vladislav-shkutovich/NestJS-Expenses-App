import { Type } from 'class-transformer'
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class TransferQueryParamsDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
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
  @IsMongoId()
  @Type(() => Types.ObjectId)
  fromAccountId?: Types.ObjectId

  @IsOptional()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  toAccountId?: Types.ObjectId

  @IsOptional()
  @IsString()
  fromCurrencyCode?: string

  @IsOptional()
  @IsString()
  toCurrencyCode?: string
}
