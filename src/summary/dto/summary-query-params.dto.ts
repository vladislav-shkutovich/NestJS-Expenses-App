import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'

export class SummaryQueryParamsDto {
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
}
