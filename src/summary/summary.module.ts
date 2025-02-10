import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SUMMARY_MODEL } from '../common/constants/database.constants'
import { SummarySchema } from './schemas/summary.schema'
import { SummaryController } from './summary.controller'
import { SummaryDatabaseService } from './summary.database.service'
import { SummaryService } from './summary.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SUMMARY_MODEL, schema: SummarySchema }]),
  ],
  controllers: [SummaryController],
  providers: [SummaryService, SummaryDatabaseService],
  exports: [SummaryService],
})
export class SummaryModule {}
