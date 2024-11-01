import { Type } from 'class-transformer'
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class AccountQueryParamsDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId

  @IsOptional()
  @IsString()
  currencyCode?: string

  @IsOptional()
  @IsString()
  accountType?: string

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSavings?: boolean
}
