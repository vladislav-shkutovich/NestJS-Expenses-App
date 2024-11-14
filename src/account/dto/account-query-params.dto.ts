import {
  IsBoolean,
  IsEnum,
  IsISO4217CurrencyCode,
  IsOptional,
} from 'class-validator'
import { Types } from 'mongoose'

import { TransformToBoolean } from '../../common/decorators/transform-to-boolean.decorator'
import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'
import { AccountType } from '../account.types'

export class AccountQueryParamsDto {
  @TransformToValidObjectId()
  userId: Types.ObjectId

  @IsOptional()
  @IsISO4217CurrencyCode()
  currencyCode?: string

  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType

  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isSavings?: boolean
}
