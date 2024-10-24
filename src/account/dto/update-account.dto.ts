import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { AccountType } from '../account.types'

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsEnum(AccountType)
  @IsOptional()
  accountType?: AccountType
}
