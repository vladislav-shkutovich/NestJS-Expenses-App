import { Transform } from 'class-transformer'
import {
  IsArray,
  IsISO4217CurrencyCode,
  IsOptional,
  IsString,
  IsUppercase,
} from 'class-validator'

export class CurrencyQueryParamsDto {
  @IsOptional()
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  @IsArray()
  @IsString({ each: true })
  @IsISO4217CurrencyCode({ each: true })
  @IsUppercase({ each: true })
  code?: string[]
}
