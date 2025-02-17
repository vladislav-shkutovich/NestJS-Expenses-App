import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AccountModule } from '../account/account.module'
import { TRANSFER_MODEL } from '../common/constants/database.constants'
import { TransactionModule } from '../transaction/transaction.module'
import { TransferSchema } from './schemas/transfer.schema'
import { TransferController } from './transfer.controller'
import { TransferDatabaseService } from './transfer.database.service'
import { TransferService } from './transfer.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TRANSFER_MODEL, schema: TransferSchema },
    ]),
    AccountModule,
    TransactionModule,
  ],
  controllers: [TransferController],
  providers: [TransferService, TransferDatabaseService],
})
export class TransferModule {}
