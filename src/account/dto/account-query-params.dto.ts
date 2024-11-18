import {
  IsBoolean,
  IsEnum,
  IsISO4217CurrencyCode,
  IsOptional,
} from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformBooleanStringToBoolean } from '../../common/decorators/transform-boolean-string-to-boolean.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'
import { AccountType } from '../account.types'

export class AccountQueryParamsDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @IsOptional()
  @IsISO4217CurrencyCode()
  currencyCode?: string

  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType

  @IsOptional()
  @TransformBooleanStringToBoolean()
  @IsBoolean()
  isSavings?: boolean
}
