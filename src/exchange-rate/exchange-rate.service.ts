import { Injectable } from '@nestjs/common'

import { ExchangeRateQueryParamsDto } from './dto/exchange-rate-query-params.dto'
import { ExchangeRateDatabaseService } from './exchange-rate.database.service'
import { ExchangeRate } from './schemas/exchange-rate.schema'

@Injectable()
export class ExchangeRateService {
  constructor(
    private readonly exchangeRateDatabaseService: ExchangeRateDatabaseService,
  ) {}

  async getExchangeRates(
    options: ExchangeRateQueryParamsDto,
  ): Promise<ExchangeRate[]> {
    return await this.exchangeRateDatabaseService.getExchangeRates(options)
  }
}
