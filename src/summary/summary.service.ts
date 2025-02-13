import { Injectable } from '@nestjs/common'

import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'
import { SummaryDatabaseService } from './summary.database.service'
import type {
  SummaryOnAccountCreateParams,
  SummaryOnTransactionCreateDeleteParams,
  SummaryOnTransactionUpdateParams,
} from './summary.types'

@Injectable()
export class SummaryService {
  constructor(
    private readonly summaryDatabaseService: SummaryDatabaseService,
  ) {}

  async getSummaries(options: SummaryQueryParamsDto): Promise<Summary[]> {
    return await this.summaryDatabaseService.getSummaries(options)
  }

  async createSummary(date: Date): Promise<void> {
    console.log(date)
    throw new Error('createSummary in not implemented')
  }

  async processSummariesOnAccountCreate(
    params: SummaryOnAccountCreateParams,
  ): Promise<void> {
    console.log(params)
    throw new Error('processSummariesOnAccountCreate in not implemented')
  }

  async processSummariesOnOperationCreateDelete(
    params: SummaryOnTransactionCreateDeleteParams,
  ) {
    console.log(params)
    throw new Error(
      'processSummariesOnOperationCreateDelete in not implemented',
    )
  }

  async processSummariesOnOperationUpdate(
    params: SummaryOnTransactionUpdateParams,
  ) {
    console.log(params)
    throw new Error('processSummariesOnOperationUpdate in not implemented')
  }

  // TODO: - Check if it possible to unite process summary methods for operations and transfers;
  async processSummariesOnTransferCreateDelete(
    params: SummaryOnTransactionCreateDeleteParams,
  ) {
    console.log(params)
    throw new Error('processSummariesOnTransferCreateDelete in not implemented')
  }

  async processSummariesOnTransferUpdate(
    params: SummaryOnTransactionUpdateParams,
  ) {
    console.log(params)
    throw new Error('processSummariesOnTransferUpdate in not implemented')
  }
}
