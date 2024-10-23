import { Injectable } from '@nestjs/common'

import { OperationDatabaseService } from './operation.database.service'

@Injectable()
export class OperationService {
  constructor(
    private readonly operationDatabaseService: OperationDatabaseService,
  ) {}
}
