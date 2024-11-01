import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TRANSFER_MODEL } from '../common/constants/database.constants'
import { TransferSchema } from './schemas/transfer.schema'
import { TransferController } from './transfer.controller'
import { TransferDatabaseService } from './transfer.database.service'
import { TransferService } from './transfer.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TRANSFER_MODEL, schema: TransferSchema },
    ]),
  ],
  controllers: [TransferController],
  providers: [TransferService, TransferDatabaseService],
})
export class TransferModule {}
