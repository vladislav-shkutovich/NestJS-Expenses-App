import { Injectable } from '@nestjs/common'

import { CurrencyDatabaseService } from './currency.database.service'
import { CurrencyQueryParamsDto } from './dto/currency-query-params.dto'
import type { Currency } from './schemas/currency.schema'

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyDatabaseService: CurrencyDatabaseService,
  ) {}

  async getCurrencies(options: CurrencyQueryParamsDto): Promise<Currency[]> {
    return await this.currencyDatabaseService.getCurrencies(options)
  }
}
