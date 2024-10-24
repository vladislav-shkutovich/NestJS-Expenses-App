import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

export class CreateOperationDto {
  @IsMongoId()
  accountId: Types.ObjectId

  @IsMongoId()
  categoryId: Types.ObjectId

  @IsNumber()
  amount: number

  @IsDate()
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
