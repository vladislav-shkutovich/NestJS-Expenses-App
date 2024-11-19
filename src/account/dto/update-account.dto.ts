import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { AccountTypeToUpdate } from '../account.types'

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsEnum(AccountTypeToUpdate)
  @IsOptional()
  accountType?: AccountTypeToUpdate
}
