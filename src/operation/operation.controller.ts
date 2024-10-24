import { Controller } from '@nestjs/common'

import { OPERATIONS_ROUTE } from '../common/constants/routing.constants'
import { OperationService } from './operation.service'

@Controller(OPERATIONS_ROUTE)
export class OperationController {
  constructor(private readonly operationService: OperationService) {}
}
