import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { CURRENCY_MODEL } from '../common/constants/database.constants'
import { CurrencyQueryParamsDto } from './dto/currency-query-params.dto'
import type { Currency } from './schemas/currency.schema'

@Injectable()
export class CurrencyDatabaseService {
  constructor(
    @InjectModel(CURRENCY_MODEL) private currencyModel: Model<Currency>,
  ) {}

  async getCurrencies(options: CurrencyQueryParamsDto): Promise<Currency[]> {
    const filter: FilterQuery<Currency> = {}

    if (options.code) {
      filter.code = { $in: options.code }
    }

    return await this.currencyModel.find(filter).lean()
  }

  async isCurrencyExistByQuery(query: FilterQuery<Currency>): Promise<boolean> {
    const currency = await this.currencyModel.findOne(query, { _id: 1 })
    return !!currency
  }
}
