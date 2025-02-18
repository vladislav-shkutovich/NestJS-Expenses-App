import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EXCHANGE_RATE_MODEL } from '../common/constants/database.constants'
import { CurrencyModule } from '../currency/currency.module'
import { EXCHANGE_RATE_ADAPTER } from './exchange-rate.constants'
import { ExchangeRateController } from './exchange-rate.controller'
import { ExchangeRateDatabaseService } from './exchange-rate.database.service'
import { ExchangeRateService } from './exchange-rate.service'
import { NbrbApiService } from './nbrb-api.service'
import { ExchangeRateSchema } from './schemas/exchange-rate.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EXCHANGE_RATE_MODEL, schema: ExchangeRateSchema },
    ]),
    CurrencyModule,
  ],
  controllers: [ExchangeRateController],
  providers: [
    {
      provide: EXCHANGE_RATE_ADAPTER,
      useClass: NbrbApiService,
    },
    ExchangeRateService,
    ExchangeRateDatabaseService,
  ],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
