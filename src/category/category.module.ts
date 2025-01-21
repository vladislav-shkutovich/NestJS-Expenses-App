import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CATEGORY_MODEL } from '../common/constants/database.constants'
import { OperationModule } from '../operation/operation.module'
import { CategoryController } from './category.controller'
import { CategoryDatabaseService } from './category.database.service'
import { CategoryService } from './category.service'
import { CategorySchema } from './schemas/category.schema'

// ! TODO: - Refactoring: rebuild app architecture to remove `forwardRef` usage in Category and Operation modules using a new SharedModule;
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CATEGORY_MODEL, schema: CategorySchema },
    ]),
    forwardRef(() => OperationModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryDatabaseService],
  exports: [CategoryService],
})
export class CategoryModule {}
