import { Type } from 'class-transformer'
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class TransferQueryParamsDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date

  @IsOptional()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  accountId?: Types.ObjectId

  @IsOptional()
  @IsString()
  currencyCode?: string
}
