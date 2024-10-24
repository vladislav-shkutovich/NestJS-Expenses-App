import { Controller } from '@nestjs/common'

import { TRANSFERS_ROUTE } from '../common/constants/routing.constants'
import { TransferService } from './transfer.service'

@Controller(TRANSFERS_ROUTE)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}
}
