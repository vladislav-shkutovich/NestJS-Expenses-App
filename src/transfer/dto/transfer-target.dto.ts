import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class TransferTargetDto {
  @IsMongoId()
  accountId: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  currencyCode: string

  @IsNumber()
  amount: number
}
