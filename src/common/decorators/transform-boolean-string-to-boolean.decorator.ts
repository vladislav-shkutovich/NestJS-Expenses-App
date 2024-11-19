import { Transform } from 'class-transformer'

export function TransformBooleanStringToBoolean() {
  return Transform(({ key, value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    console.warn(
      `Transforming ${key}: initial value ${value} is not boolean string true or false`,
    )
    return value
  })
}
