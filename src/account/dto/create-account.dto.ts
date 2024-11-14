import {
  IsBoolean,
  IsEnum,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'
import { AccountType } from '../account.types'

export class CreateAccountDto {
  @TransformToValidObjectId()
  userId: Types.ObjectId

  @IsISO4217CurrencyCode()
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
