import { Transform } from 'class-transformer'

import { ValidationError } from '../errors/errors'

export function TransformBooleanStringToBoolean() {
  return Transform(({ key, value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    throw new ValidationError(`${key} must be true or false`)
  })
}
