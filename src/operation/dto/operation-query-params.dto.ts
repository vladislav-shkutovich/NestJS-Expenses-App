import { Type } from 'class-transformer'
import { IsDate, IsMongoId, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class OperationQueryParamsDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date

  @IsOptional()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  categoryId?: Types.ObjectId

  @IsOptional()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  accountId?: Types.ObjectId
}
