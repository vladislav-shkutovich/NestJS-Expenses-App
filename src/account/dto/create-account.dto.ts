import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

import { AccountType } from '../account.types'

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  currencyCode: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(AccountType)
  accountType: AccountType

  @IsBoolean()
  @IsOptional()
  isSavings?: boolean

  @IsNumber()
  @IsOptional()
  balance?: number
}
