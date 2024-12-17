import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { AMOUNT_DECIMAL_PLACES } from '../constants/formatting.constants'

export function IsValidAmount(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidAmount',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ValidateAmount,
    })
  }
}

@ValidatorConstraint({ name: 'isValidAmount', async: false })
class ValidateAmount implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'number') return false

    if (Number.isInteger(value)) return true

    const decimalPart = value.toString().split('.')[1]

    if (decimalPart && decimalPart.length <= AMOUNT_DECIMAL_PLACES) return true

    return false
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be an integer or a number with no more than ${AMOUNT_DECIMAL_PLACES} decimal places`
  }
}
