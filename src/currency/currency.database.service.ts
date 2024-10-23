import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CURRENCY_MODEL } from '../common/constants/database.constants'
import type { Currency } from './schemas/currency.schema'

@Injectable()
export class CurrencyDatabaseService {
  constructor(
    @InjectModel(CURRENCY_MODEL) private currencyModel: Model<Currency>,
  ) {}
}
