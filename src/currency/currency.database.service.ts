import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CURRENCY_MODEL } from '../common/constants/database.constants'
import type { Currency } from './schemas/currency.schema'

@Injectable()
export class CurrencyDatabaseService {
  constructor(
    @InjectModel(CURRENCY_MODEL) private currencyModel: Model<Currency>,
  ) {}

  async getAllCurrencies(): Promise<Currency[]> {
    return [] as Currency[]
  }

  async getCurrencyById(id: Types.ObjectId): Promise<Currency> {
    console.error('mock id', id)
    return {} as Currency
  }
}
