import { Controller, Get, Param } from '@nestjs/common'

import { CURRENCIES_ROUTE } from '../common/constants/routing.constants'
import { CurrencyService } from './currency.service'
import { CurrencyParamDto } from './dto/currency-param.dto'
import type { Currency } from './schemas/currency.schema'

@Controller(CURRENCIES_ROUTE)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getAllCurrencies(): Promise<Currency[]> {
    return await this.currencyService.getAllCurrencies()
  }

  @Get(':code')
  async getCurrencyByCode(
    @Param() params: CurrencyParamDto,
  ): Promise<Currency> {
    return await this.currencyService.getCurrencyByCode(params.code)
  }
}
