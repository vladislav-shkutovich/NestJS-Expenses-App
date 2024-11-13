import { Type } from 'class-transformer'
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
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId

  @IsMongoId()
  @Type(() => Types.ObjectId)
  accountId: Types.ObjectId

  @IsMongoId()
  @Type(() => Types.ObjectId)
  categoryId: Types.ObjectId

  @IsNumber()
  amount: number

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
