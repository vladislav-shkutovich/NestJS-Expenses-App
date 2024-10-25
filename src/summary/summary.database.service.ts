import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { SUMMARY_MODEL } from '../common/constants/database.constants'
import { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type { Summary } from './schemas/summary.schema'

@Injectable()
export class SummaryDatabaseService {
  constructor(
    @InjectModel(SUMMARY_MODEL) private summaryModel: Model<Summary>,
  ) {}

  async getSummariesByUser(
    userId: Types.ObjectId,
    options: SummaryQueryParamsDto,
  ): Promise<Summary[]> {
    console.error('mock userId', userId)
    console.error('mock options', options)
    return [] as Summary[]
  }
}
