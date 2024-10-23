import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { EXCHANGE_RATE_MODEL } from '../common/constants/database.constants'
import type { ExchangeRate } from './schemas/exchange-rate.schema'

@Injectable()
export class ExchangeRateDatabaseService {
  constructor(
    @InjectModel(EXCHANGE_RATE_MODEL)
    private exchangeRateModel: Model<ExchangeRate>,
  ) {}
}
