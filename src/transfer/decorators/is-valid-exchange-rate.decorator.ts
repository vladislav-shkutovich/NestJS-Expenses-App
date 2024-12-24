import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { EXCHANGE_RATE_DECIMAL_PLACES } from '../../common/constants/formatting.constants'

export function IsValidExchangeRate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidExchangeRate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ValidateExchangeRate,
    })
  }
}

@ValidatorConstraint({ name: 'isValidExchangeRate', async: false })
class ValidateExchangeRate implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'number' || value <= 0) return false

    if (Number.isInteger(value)) return true

    const decimalPart = value.toString().split('.')[1]

    if (decimalPart && decimalPart.length <= EXCHANGE_RATE_DECIMAL_PLACES)
      return true

    return false
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a positive integer or a positive number with no more than ${EXCHANGE_RATE_DECIMAL_PLACES} decimal places`
  }
}
