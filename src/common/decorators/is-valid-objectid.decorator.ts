import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Types } from 'mongoose'

export function IsValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
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
  validate(value: any): boolean {
    return Types.ObjectId.isValid(value) && value instanceof Types.ObjectId
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a value that matches ObjectId`
  }
}
