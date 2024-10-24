import { Controller } from '@nestjs/common'

import { CATEGORIES_ROUTE } from '../common/constants/routing.constants'
import { CategoryService } from './category.service'

@Controller(CATEGORIES_ROUTE)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
}
