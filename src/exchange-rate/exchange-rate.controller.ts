import { Controller } from '@nestjs/common'

import { EXCHANGE_RATES_ROUTE } from '../common/constants/routing.constants'
import { ExchangeRateService } from './exchange-rate.service'

@Controller(EXCHANGE_RATES_ROUTE)
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}
}
