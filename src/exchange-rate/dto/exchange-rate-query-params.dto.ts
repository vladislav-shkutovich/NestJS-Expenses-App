import { Type } from 'class-transformer'
import { IsDate, IsISO4217CurrencyCode, IsOptional } from 'class-validator'

export class ExchangeRateQueryParamsDto {
  @IsISO4217CurrencyCode()
  baseCurrency: string

  @IsOptional()
  @IsISO4217CurrencyCode()
  targetCurrency?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date
}
