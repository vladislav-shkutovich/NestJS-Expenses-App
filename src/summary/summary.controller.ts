import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { SUMMARIES_ROUTE } from '../common/constants/routing.constants'
import { UserIdOwnershipGuard } from '../common/guards/user-id-ownership.guard'
import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'
import { SummaryService } from './summary.service'

@Controller(SUMMARIES_ROUTE)
@UseGuards(UserIdOwnershipGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  async getSummaries(
    @Query() query: SummaryQueryParamsDto,
  ): Promise<Summary[]> {
    return await this.summaryService.getSummaries(query)
  }
}
