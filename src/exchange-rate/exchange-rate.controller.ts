import { Controller, Get, Query } from '@nestjs/common'

import { EXCHANGE_RATES_ROUTE } from '../common/constants/routing.constants'
import { ExchangeRateQueryParamsDto } from './dto/exchange-rate-query-params.dto'
import { ExchangeRateService } from './exchange-rate.service'
import { ExchangeRate } from './schemas/exchange-rate.schema'

@Controller(EXCHANGE_RATES_ROUTE)
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get()
  async getExchangeRatesOnDate(
    @Query() query: ExchangeRateQueryParamsDto,
  ): Promise<ExchangeRate[]> {
    return await this.exchangeRateService.getExchangeRatesOnDate(query)
  }
}
