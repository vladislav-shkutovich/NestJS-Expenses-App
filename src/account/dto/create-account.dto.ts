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

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'
import { AccountType } from '../account.types'

export class CreateAccountDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
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
