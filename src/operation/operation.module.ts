import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AccountModule } from '../account/account.module'
import { CategoryModule } from '../category/category.module'
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
    AccountModule,
    forwardRef(() => CategoryModule),
  ],
  controllers: [OperationController],
  providers: [OperationService, OperationDatabaseService],
  exports: [OperationDatabaseService],
})
export class OperationModule {}
