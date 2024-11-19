import { Types } from 'mongoose'

import { IsValidObjectId } from '../decorators/is-valid-objectid.decorator'
import { TransformStringToObjectId } from '../decorators/transform-string-to-objectid.decorator'

export class IdParamDto {
  @TransformStringToObjectId()
  @IsValidObjectId()
  id: Types.ObjectId
}
