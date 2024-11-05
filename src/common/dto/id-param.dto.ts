import { Type } from 'class-transformer'
import { IsMongoId } from 'class-validator'
import { Types } from 'mongoose'

export class IdParamDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  id: Types.ObjectId
}
