import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CURRENCY_MODEL } from '../common/constants/database.constants'
import { CurrencyController } from './currency.controller'
import { CurrencyDatabaseService } from './currency.database.service'
import { CurrencyService } from './currency.service'
import { CurrencySchema } from './schemas/currency.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CURRENCY_MODEL, schema: CurrencySchema },
    ]),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyDatabaseService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
