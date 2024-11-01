import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CURRENCY_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import type { Currency } from './schemas/currency.schema'

@Injectable()
export class CurrencyDatabaseService {
  constructor(
    @InjectModel(CURRENCY_MODEL) private currencyModel: Model<Currency>,
  ) {}

  async getAllCurrencies(): Promise<Currency[]> {
    return await this.currencyModel.find().lean()
  }

  async getCurrencyByCode(code: string): Promise<Currency> {
    const currencyByCode = await this.currencyModel.findOne({ code }).lean()

    if (!currencyByCode) {
      throw new NotFoundError(`Currency with code ${code} not found`)
    }

    return currencyByCode
  }
}
