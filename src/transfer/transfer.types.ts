import { CreateTransferDto } from './dto/create-transfer.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import { TransferTarget } from './schemas/transfer.schema'

export type CreateTransferContent = Omit<CreateTransferDto, 'from' | 'to'> & {
  from: TransferTarget
  to: TransferTarget
}

export type UpdateTransferContent = Omit<UpdateTransferDto, 'from' | 'to'> & {
  from?: TransferTarget
  to?: TransferTarget
}
