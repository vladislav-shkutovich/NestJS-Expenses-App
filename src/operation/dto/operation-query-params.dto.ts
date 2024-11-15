import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../../common/decorators/transform-to-valid-objectid.decorator'

export class OperationQueryParamsDto {
  @TransformToValidObjectId()
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
  @TransformToValidObjectId()
  categoryId?: Types.ObjectId

  @IsOptional()
  @TransformToValidObjectId()
  accountId?: Types.ObjectId
}
