import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { CurrencyDatabaseService } from './currency.database.service'
import type { Currency } from './schemas/currency.schema'

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyDatabaseService: CurrencyDatabaseService,
  ) {}

  async getAllCurrencies(): Promise<Currency[]> {
    return await this.currencyDatabaseService.getAllCurrencies()
  }

  async getCurrencyById(id: Types.ObjectId): Promise<Currency> {
    return await this.currencyDatabaseService.getCurrencyById(id)
  }
}
