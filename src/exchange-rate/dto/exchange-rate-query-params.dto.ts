import { Type } from 'class-transformer'
import {
  IsDate,
  IsISO4217CurrencyCode,
  IsNumber,
  IsOptional,
} from 'class-validator'

export class ExchangeRateQueryParamsDto {
  @IsISO4217CurrencyCode()
  baseCurrency: string

  @IsISO4217CurrencyCode()
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
