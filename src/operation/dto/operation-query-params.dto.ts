import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'
import { OperationType } from '../operation.types'

export class OperationQueryParamsDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
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
  @TransformStringToObjectId()
  @IsValidObjectId()
  categoryId?: Types.ObjectId

  @IsOptional()
  @TransformStringToObjectId()
  @IsValidObjectId()
  accountId?: Types.ObjectId

  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType
}
