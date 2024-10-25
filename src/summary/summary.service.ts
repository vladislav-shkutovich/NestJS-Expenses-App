import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'
import { SummaryDatabaseService } from './summary.database.service'

@Injectable()
export class SummaryService {
  constructor(
    private readonly summaryDatabaseService: SummaryDatabaseService,
  ) {}

  async getSummariesByUser(
    userId: Types.ObjectId,
    options: SummaryQueryParamsDto,
  ): Promise<Summary[]> {
    return await this.summaryDatabaseService.getSummariesByUser(userId, options)
  }
}
