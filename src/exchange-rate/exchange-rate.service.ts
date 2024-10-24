import { Injectable } from '@nestjs/common'

import { ExchangeRateDatabaseService } from './exchange-rate.database.service'

@Injectable()
export class ExchangeRateService {
  constructor(
    private readonly exchangeRateDatabaseService: ExchangeRateDatabaseService,
  ) {}
}
