import { Controller } from '@nestjs/common'

import { CURRENCIES_ROUTE } from '../common/constants/routing.constants'
import { CurrencyService } from './currency.service'

@Controller(CURRENCIES_ROUTE)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
}
