import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Transfer } from '../schemas/transfer.schema'

export function IsValidTransferAmounts(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidTransferAmounts',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ValidateTransferFromToAmounts,
    })
  }
}

@ValidatorConstraint({ name: 'ValidateTransferFromToAmounts', async: false })
class ValidateTransferFromToAmounts implements ValidatorConstraintInterface {
  validate(_value: any, args: ValidationArguments): boolean {
    const transfer = args.object as Transfer
    const fromAmount = transfer.from?.amount
    const toAmount = transfer.to?.amount

    const isOnlyFromAmountDefined =
      fromAmount !== undefined && toAmount === undefined
    const isOnlyToAmountDefined =
      toAmount !== undefined && fromAmount === undefined

    return isOnlyFromAmountDefined || isOnlyToAmountDefined
  }

  defaultMessage(): string {
    return 'Amount is required in the from.amount or to.amount field, but only in one of them'
  }
}
