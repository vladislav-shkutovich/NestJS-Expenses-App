import { IsISO4217CurrencyCode, IsString, IsUppercase } from 'class-validator'

export class CurrencyParamDto {
  @IsString()
  @IsISO4217CurrencyCode()
  @IsUppercase()
  code: string
}
