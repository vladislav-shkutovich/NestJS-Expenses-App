import {
  IsBoolean,
  IsEnum,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

import { IsValidAmount } from '../../common/decorators/is-valid-amount.decorator'
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

  @IsValidAmount()
  @IsOptional()
  balance?: number
}
