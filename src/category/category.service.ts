import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { UserService } from '../user/user.service'
import { CategoryDatabaseService } from './category.database.service'
import { UpdateCategoryOperators } from './category.types'
import { CategoryQueryParamsDto } from './dto/category-query-params.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import type { Category } from './schemas/category.schema'
import { OperationService } from '../operation/operation.service'
import { UnprocessableError } from '../common/errors/errors'

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryDatabaseService: CategoryDatabaseService,
    private readonly operationService: OperationService,
    private readonly userService: UserService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { userId } = createCategoryDto

    await this.userService.ensureUserExists(userId)

    return await this.categoryDatabaseService.createCategory(createCategoryDto)
  }

  async getCategoryById(id: Types.ObjectId): Promise<Category> {
    return await this.categoryDatabaseService.getCategoryById(id)
  }

  async getCategoriesByUser(
    options: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    const { userId } = options

    await this.userService.ensureUserExists(userId)

    return await this.categoryDatabaseService.getCategoriesByUser(options)
  }

  async updateCategory(
    id: Types.ObjectId,
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
      updateCategoryOperators,
    )
  }

  async deleteCategory(id: Types.ObjectId): Promise<void> {
    const isCategoryUsedInOperations =
      await this.operationService.isOperationExistByQuery({
        categoryId: id,
      })

    if (isCategoryUsedInOperations) {
      throw new UnprocessableError(
        'You cannot delete a category that is already in use in operations. You can archive this category instead.',
      )
    }

    return await this.categoryDatabaseService.deleteCategory(id)
  }
}
