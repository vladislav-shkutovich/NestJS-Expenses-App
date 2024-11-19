import { IsISO4217CurrencyCode, IsNumber } from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'

export class TransferTargetDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  accountId: Types.ObjectId

  @IsISO4217CurrencyCode()
  currencyCode: string

  @IsNumber()
  amount: number
}
