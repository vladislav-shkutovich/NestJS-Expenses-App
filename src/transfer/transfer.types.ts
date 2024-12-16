import { CreateTransferDto } from './dto/create-transfer.dto'

export type CreateTransferContent = CreateTransferDto & {
  from: { currencyCode: string }
  to: { currencyCode: string }
}
