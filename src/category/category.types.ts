import { UpdateQuery } from 'mongoose'

import type { UpdateCategoryDto } from './dto/update-category.dto'
import type { Category } from './schemas/category.schema'

export enum CategoryType {
  INCOME = 'income',
  WITHDRAWAL = 'withdrawal',
}

export type UpdateCategoryOperators = UpdateQuery<Category> & {
  $set: UpdateCategoryDto & {
    archivedAt?: Category['archivedAt']
  }
  $unset: {
    archivedAt?: null
  }
}
