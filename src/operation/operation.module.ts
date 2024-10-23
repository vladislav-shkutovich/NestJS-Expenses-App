import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OPERATION_MODEL } from '../common/constants/database.constants'
import { OperationController } from './operation.controller'
import { OperationDatabaseService } from './operation.database.service'
import { OperationService } from './operation.service'
import { OperationSchema } from './schemas/operation.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OPERATION_MODEL, schema: OperationSchema },
    ]),
  ],
  controllers: [OperationController],
  providers: [OperationService, OperationDatabaseService],
})
export class OperationModule {}
