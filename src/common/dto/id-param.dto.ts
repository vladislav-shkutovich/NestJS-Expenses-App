import { Types } from 'mongoose'

import { TransformToValidObjectId } from '../decorators/transform-to-valid-objectid.decorator'

export class IdParamDto {
  @TransformToValidObjectId({ message: 'id must be a valid ObjectId' })
  id: Types.ObjectId
}
