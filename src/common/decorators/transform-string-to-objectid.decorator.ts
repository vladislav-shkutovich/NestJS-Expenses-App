import { Transform } from 'class-transformer'
import { Types } from 'mongoose'

export function TransformStringToObjectId() {
  return Transform(({ key, value }) => {
    if (typeof value !== 'string') {
      console.warn(`Transforming ${key}: initial value ${value} is not string`)
      return value
    }
    try {
      return new Types.ObjectId(value)
    } catch {
      console.warn(
        `Transforming ${key}: failed to create ObjectId from value ${value}`,
      )
      return value
    }
  })
}
