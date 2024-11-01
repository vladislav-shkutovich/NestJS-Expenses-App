import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { CategoryDatabaseService } from './category.database.service'
import { CategoryQueryParamsDto } from './dto/category-query-params.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import type { Category } from './schemas/category.schema'

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryDatabaseService: CategoryDatabaseService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryDatabaseService.createCategory(createCategoryDto)
  }

  async getCategoryById(id: Types.ObjectId): Promise<Category> {
    return await this.categoryDatabaseService.getCategoryById(id)
  }

  async getCategoriesByUser(
    options: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    return await this.categoryDatabaseService.getCategoriesByUser(options)
  }

  async updateCategory(
    id: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryDatabaseService.updateCategory(
      id,
      updateCategoryDto,
    )
  }

  async deleteCategory(id: Types.ObjectId): Promise<void> {
    return await this.categoryDatabaseService.deleteCategory(id)
  }
}
