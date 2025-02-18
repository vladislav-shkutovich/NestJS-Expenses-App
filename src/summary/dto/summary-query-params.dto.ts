import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { Types } from 'mongoose'

import { IsValidObjectId } from '../../common/decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../../common/decorators/transform-string-to-objectid.decorator'

export class SummaryQueryParamsDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  userId: Types.ObjectId

  @IsDate()
  @Type(() => Date)
  dateFrom: Date

  @IsDate()
  @Type(() => Date)
  dateTo: Date
}
