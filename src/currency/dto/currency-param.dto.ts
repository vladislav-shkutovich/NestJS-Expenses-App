import { Transform } from 'class-transformer'
import { IsString, Matches } from 'class-validator'

export class CurrencyParamDto {
  @IsString()
  @Matches(/^[A-Za-z]{3}$/, {
    message: 'Currency code must consist of three letters',
  })
  @Transform(({ value }) => value.toUpperCase())
  code: string
}
