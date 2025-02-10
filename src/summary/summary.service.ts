import { Injectable } from '@nestjs/common'

import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'
import { SummaryDatabaseService } from './summary.database.service'

@Injectable()
export class SummaryService {
  constructor(
    private readonly summaryDatabaseService: SummaryDatabaseService,
  ) {}

  async getSummaries(options: SummaryQueryParamsDto): Promise<Summary[]> {
    return await this.summaryDatabaseService.getSummaries(options)
  }
}
