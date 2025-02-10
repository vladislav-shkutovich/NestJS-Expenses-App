import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { SUMMARY_MODEL } from '../common/constants/database.constants'
import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'

@Injectable()
export class SummaryDatabaseService {
  constructor(
    @InjectModel(SUMMARY_MODEL) private summaryModel: Model<Summary>,
  ) {}

  async getSummaries(options: SummaryQueryParamsDto): Promise<Summary[]> {
    const { dateFrom, dateTo, ...restOptions } = options

    const query: FilterQuery<Summary> = {
      ...restOptions,
      dateFrom: {
        $gte: dateFrom,
      },
      dateTo: {
        $lte: dateTo,
      },
    }

    const summaries = await this.summaryModel.find(query)

    return summaries.map((summary) => summary.toObject())
  }
}
