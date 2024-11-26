import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { ValidationError } from '../common/errors/errors'
import { UserService } from '../user/user.service'
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
    private readonly userService: UserService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { userId, name } = createCategoryDto

    await this.userService.ensureUserExists(userId)

    await this.ensureUserCategoryUnique(userId, name)

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
    const { name: updatedName, isArchived } = updateCategoryDto

    if (updatedName) {
      const { userId, name: currentName } = await this.getCategoryById(id)
      if (updatedName !== currentName) {
        await this.ensureUserCategoryUnique(userId, updatedName)
      }
    }

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
    // TODO: - Provide a rejection on deleting a category if it is used in at least one operation; *after Operation module implementation

    return await this.categoryDatabaseService.deleteCategory(id)
  }

  private async ensureUserCategoryUnique(
    userId: Types.ObjectId,
    categoryName: string,
  ): Promise<void> {
    const isUserCategoryDuplicate =
      await this.categoryDatabaseService.isCategoryExistByQuery({
        userId,
        name: categoryName,
      })

    if (isUserCategoryDuplicate) {
      throw new ValidationError(
        `Category name ${categoryName} already exists for this user`,
      )
    }
  }
}
