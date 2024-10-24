import { Injectable } from '@nestjs/common'

import { CategoryDatabaseService } from './category.database.service'

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryDatabaseService: CategoryDatabaseService,
  ) {}
}
