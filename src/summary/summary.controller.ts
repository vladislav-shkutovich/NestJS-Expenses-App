import { Controller, Get, Param, Query } from '@nestjs/common'

import { SUMMARIES_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'
import { SummaryService } from './summary.service'

@Controller(SUMMARIES_ROUTE)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('/user/:id')
  async getSummariesByUser(
    @Param() params: IdParamDto,
    @Query() query: SummaryQueryParamsDto,
  ): Promise<Summary[]> {
    return await this.summaryService.getSummariesByUser(params.id, query)
  }
}
