import { Injectable } from '@nestjs/common'

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

  async getCurrencyByCode(code: string): Promise<Currency> {
    return await this.currencyDatabaseService.getCurrencyByCode(code)
  }
}
