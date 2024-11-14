import { Transform } from 'class-transformer'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Types } from 'mongoose'

/**
 * Transforms a value to an ObjectId and validates it.
 * 1. **Transformation**: Converts the incoming value to a `Types.ObjectId` if it is a valid ObjectId string.
 * 2. **Validation**: Ensures that the value is a valid `ObjectId`. If the transformation fails or the value is not a valid ObjectId, validation will fail.
 */
export function TransformToValidObjectId(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    Transform(({ value }) =>
      typeof value === 'string' && Types.ObjectId.isValid(value)
        ? new Types.ObjectId(value)
        : String(value),
    )(object, propertyName)

    registerDecorator({
      name: 'validateObjectId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ValidateObjectId,
    })
  }
}

@ValidatorConstraint({ name: 'validateObjectId', async: false })
class ValidateObjectId implements ValidatorConstraintInterface {
  validate(value: string | Types.ObjectId): boolean {
    return Types.ObjectId.isValid(value)
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid string that matches ObjectId`
  }
}
