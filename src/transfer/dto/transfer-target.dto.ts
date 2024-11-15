import { IsISO4217CurrencyCode, IsNumber } from 'class-validator'
import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'

export class TransferTargetDto {
  @TransformToValidObjectId()
  accountId: Types.ObjectId

  @IsISO4217CurrencyCode()
  currencyCode: string

  @IsNumber()
  amount: number
}
