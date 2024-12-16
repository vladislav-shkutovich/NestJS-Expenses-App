import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { CURRENCY_MODEL } from '../common/constants/database.constants'
import { removeUndefined } from '../common/utils/formatting.utils'
import { CurrencyQueryParamsDto } from './dto/currency-query-params.dto'
import type { Currency } from './schemas/currency.schema'

@Injectable()
export class CurrencyDatabaseService {
  constructor(
    @InjectModel(CURRENCY_MODEL) private currencyModel: Model<Currency>,
  ) {}

  async getCurrencies(options: CurrencyQueryParamsDto): Promise<Currency[]> {
    const filter: FilterQuery<Currency> = removeUndefined({
      ...options,
      ...(options.code && {
        code: {
          $in: options.code,
        },
      }),
    })

    return await this.currencyModel.find(filter).lean()
  }
}
