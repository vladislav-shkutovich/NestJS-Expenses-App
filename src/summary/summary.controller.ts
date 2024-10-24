import { Controller } from '@nestjs/common'

import { SUMMARIES_ROUTE } from '../common/constants/routing.constants'
import { SummaryService } from './summary.service'

@Controller(SUMMARIES_ROUTE)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}
}
