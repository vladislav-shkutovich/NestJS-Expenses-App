import { Injectable } from '@nestjs/common'

import { TransferDatabaseService } from './transfer.database.service'

@Injectable()
export class TransferService {
  constructor(
    private readonly transferDatabaseService: TransferDatabaseService,
  ) {}
}
