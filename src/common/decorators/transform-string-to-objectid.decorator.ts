import { Transform } from 'class-transformer'
import { Types } from 'mongoose'

import { ValidationError } from '../errors/errors'

export function TransformStringToObjectId() {
  return Transform(({ key, value }) => {
    try {
      if (typeof value !== 'string') {
        throw new Error()
      }

      return new Types.ObjectId(value)
    } catch (error) {
      throw new ValidationError(`${key} must be a string that matches ObjectId`)
    }
  })
}
