import { Type } from 'class-transformer'
import { IsDate, IsMongoId, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class OperationQueryParamsDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date

  @IsOptional()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  categoryId?: Types.ObjectId

  @IsOptional()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  accountId?: Types.ObjectId
}
