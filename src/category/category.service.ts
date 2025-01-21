import { forwardRef, Inject, Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { UnprocessableError } from '../common/errors/errors'
import { OperationService } from '../operation/operation.service'
import { CategoryDatabaseService } from './category.database.service'
import { UpdateCategoryOperators } from './category.types'
import { CategoryQueryParamsDto } from './dto/category-query-params.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import type { Category } from './schemas/category.schema'

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryDatabaseService: CategoryDatabaseService,
    @Inject(forwardRef(() => OperationService))
    private readonly operationService: OperationService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryDatabaseService.createCategory(createCategoryDto)
  }

  async getCategory(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Category> {
    return await this.categoryDatabaseService.getCategory(id, userId)
  }

  async getCategories(options: CategoryQueryParamsDto): Promise<Category[]> {
    return await this.categoryDatabaseService.getCategories(options)
  }

  async updateCategory(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { isArchived } = updateCategoryDto

    const updateCategoryOperators: UpdateCategoryOperators = {
      $set: globalThis.structuredClone(updateCategoryDto),
      $unset: {},
    }

    if (isArchived === true) {
      updateCategoryOperators.$set.archivedAt = new Date()
    }

    if (isArchived === false) {
      updateCategoryOperators.$unset.archivedAt = null
    }

    return await this.categoryDatabaseService.updateCategory(
      id,
      userId,
      updateCategoryOperators,
    )
  }

  async deleteCategory(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const isCategoryUsedInOperations =
      await this.operationService.isOperationExistByQuery({
        categoryId: id,
      })

    if (isCategoryUsedInOperations) {
      throw new UnprocessableError(
        'You cannot delete a category that is already in use in operations. You can archive this category instead.',
      )
    }

    return await this.categoryDatabaseService.deleteCategory(id, userId)
  }
}
