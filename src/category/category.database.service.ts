import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CATEGORY_MODEL } from '../common/constants/database.constants'
import type { Category } from './schemas/category.schema'

@Injectable()
export class CategoryDatabaseService {
  constructor(
    @InjectModel(CATEGORY_MODEL) private categoryModel: Model<Category>,
  ) {}
}
