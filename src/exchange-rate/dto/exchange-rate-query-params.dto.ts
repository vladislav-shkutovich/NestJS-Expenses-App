import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class ExchangeRateQueryParamsDto {
  @IsString()
  baseCurrency: string

  @IsString()
  targetCurrency: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validFrom?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validTo?: Date

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: boolean
}
