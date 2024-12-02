import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CATEGORY_MODEL } from '../common/constants/database.constants'
import { OperationModule } from '../operation/operation.module'
import { UserModule } from '../user/user.module'
import { CategoryController } from './category.controller'
import { CategoryDatabaseService } from './category.database.service'
import { CategoryService } from './category.service'
import { CategorySchema } from './schemas/category.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CATEGORY_MODEL, schema: CategorySchema },
    ]),
    forwardRef(() => OperationModule),
    UserModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryDatabaseService],
  exports: [CategoryService],
})
export class CategoryModule {}
