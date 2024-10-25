import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class ExchangeRateQueryParamsDto {
  @IsOptional()
  @IsString()
  baseCurrency?: string

  @IsOptional()
  @IsString()
  targetCurrency?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validTo?: Date

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: boolean
}
