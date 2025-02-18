import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AccountModule } from '../account/account.module'
import { SUMMARY_MODEL } from '../common/constants/database.constants'
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module'
import { SummarySchema } from './schemas/summary.schema'
import { SummaryController } from './summary.controller'
import { SummaryDatabaseService } from './summary.database.service'
import { SummaryService } from './summary.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SUMMARY_MODEL, schema: SummarySchema }]),
    forwardRef(() => AccountModule),
    ExchangeRateModule,
  ],
  controllers: [SummaryController],
  providers: [SummaryService, SummaryDatabaseService],
  exports: [SummaryService],
})
export class SummaryModule {}
