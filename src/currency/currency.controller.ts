import { Controller, Get, Param } from '@nestjs/common'

import { CURRENCIES_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { CurrencyService } from './currency.service'
import type { Currency } from './schemas/currency.schema'

@Controller(CURRENCIES_ROUTE)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getAllCurrencies(): Promise<Currency[]> {
    return await this.currencyService.getAllCurrencies()
  }

  @Get(':id')
  async getCurrencyById(@Param() params: IdParamDto): Promise<Currency> {
    return await this.currencyService.getCurrencyById(params.id)
  }
}
