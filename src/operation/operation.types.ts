import { CreateOperationDto } from './dto/create-operation.dto'

export type CreateOperationContent = CreateOperationDto & {
  currencyCode: string
}
