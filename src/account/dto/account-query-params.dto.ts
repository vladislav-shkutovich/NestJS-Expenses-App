import { Type } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class AccountQueryParamsDto {
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
