import { Controller, Get, Query } from '@nestjs/common'

import { SUMMARIES_ROUTE } from '../common/constants/routing.constants'
import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'
import { SummaryService } from './summary.service'

@Controller(SUMMARIES_ROUTE)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  async getSummariesByUser(
    @Query() query: SummaryQueryParamsDto,
  ): Promise<Summary[]> {
    return await this.summaryService.getSummariesByUser(query)
  }
}
