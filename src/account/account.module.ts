import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ACCOUNT_MODEL } from '../common/constants/database.constants'
import { SummaryModule } from '../summary/summary.module'
import { AccountController } from './account.controller'
import { AccountDatabaseService } from './account.database.service'
import { AccountService } from './account.service'
import { AccountSchema } from './schemas/account.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ACCOUNT_MODEL, schema: AccountSchema }]),
    SummaryModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountDatabaseService],
  exports: [AccountService],
})
export class AccountModule {}
