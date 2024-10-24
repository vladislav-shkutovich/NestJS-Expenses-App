import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { SUMMARY_MODEL } from '../common/constants/database.constants'
import type { Summary } from './schemas/summary.schema'

@Injectable()
export class SummaryDatabaseService {
  constructor(
    @InjectModel(SUMMARY_MODEL) private summaryModel: Model<Summary>,
  ) {}
}
