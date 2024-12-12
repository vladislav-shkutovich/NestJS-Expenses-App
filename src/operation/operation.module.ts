import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AccountModule } from '../account/account.module'
import { CategoryModule } from '../category/category.module'
import { OPERATION_MODEL } from '../common/constants/database.constants'
import { TransactionService } from '../common/services/transaction.service'
import { OperationController } from './operation.controller'
import { OperationDatabaseService } from './operation.database.service'
import { OperationService } from './operation.service'
import { OperationSchema } from './schemas/operation.schema'

// ! TODO: - Refactoring: rebuild app architecture to remove `forwardRef` usage in Category and Operation modules using a new SharedModule;
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OPERATION_MODEL, schema: OperationSchema },
    ]),
    AccountModule,
    forwardRef(() => CategoryModule),
  ],
  controllers: [OperationController],
  providers: [OperationService, OperationDatabaseService, TransactionService],
  exports: [OperationService],
})
export class OperationModule {}
