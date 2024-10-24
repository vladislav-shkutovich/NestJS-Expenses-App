import { Injectable } from '@nestjs/common'

import { CurrencyDatabaseService } from './currency.database.service'

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyDatabaseService: CurrencyDatabaseService,
  ) {}
}
