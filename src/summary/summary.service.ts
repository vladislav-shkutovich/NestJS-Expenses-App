import { Injectable } from '@nestjs/common'

import { SummaryDatabaseService } from './summary.database.service'

@Injectable()
export class SummaryService {
  constructor(
    private readonly summaryDatabaseService: SummaryDatabaseService,
  ) {}
}
