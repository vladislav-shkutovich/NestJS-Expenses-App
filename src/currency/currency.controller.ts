import { Controller, Get, Query } from '@nestjs/common'

import { CURRENCIES_ROUTE } from '../common/constants/routing.constants'
import { CurrencyService } from './currency.service'
import { CurrencyQueryParamsDto } from './dto/currency-query-params.dto'
import type { Currency } from './schemas/currency.schema'

@Controller(CURRENCIES_ROUTE)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getCurrencies(
    @Query() query: CurrencyQueryParamsDto,
  ): Promise<Currency[]> {
    return await this.currencyService.getCurrencies(query)
  }
}
