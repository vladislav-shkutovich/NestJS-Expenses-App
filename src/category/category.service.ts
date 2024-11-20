import { Injectable } from '@nestjs/common'

import { FilterQuery, Types } from 'mongoose'
import { NotFoundError, ValidationError } from '../common/errors/errors'
import { UserService } from '../user/user.service'
import { CategoryDatabaseService } from './category.database.service'
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

    const isUserExist = await this.userService.isUserExistByQuery({
      _id: userId,
    })

    if (!isUserExist) {
      throw new NotFoundError(`User with userId ${userId} not found`)
    }

    const isCategoryDuplicate = await this.isCategoryExistByQuery({
      userId,
      name,
    })

    if (isCategoryDuplicate) {
      throw new ValidationError(
        `Category name ${name} already exists for this user`,
      )
    }

    return await this.categoryDatabaseService.createCategory(createCategoryDto)
  }

  async getCategoryById(id: Types.ObjectId): Promise<Category> {
    return await this.categoryDatabaseService.getCategoryById(id)
  }

  async getCategoriesByUser(
    options: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    const { userId } = options

    const isUserExist = await this.userService.isUserExistByQuery({
      _id: userId,
    })

    if (!isUserExist) {
      throw new NotFoundError(`User with userId ${userId} not found`)
    }

    return await this.categoryDatabaseService.getCategoriesByUser(options)
  }

  async updateCategory(
    id: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { name: updatedName } = updateCategoryDto

    if (updatedName) {
      const { userId, name: currentName } = await this.getCategoryById(id)

      if (updatedName !== currentName) {
        const isCategoryDuplicate = await this.isCategoryExistByQuery({
          userId,
          name: updatedName,
        })

        if (isCategoryDuplicate) {
          throw new ValidationError(
            `Category name ${updatedName} already exists for this user`,
          )
        }
      }
    }

    return await this.categoryDatabaseService.updateCategory(
      id,
      updateCategoryDto,
    )
  }

  async deleteCategory(id: Types.ObjectId): Promise<void> {
    // TODO: - Provide a rejection on deleting a category if it is used in at least one operation; *after Operation module implementation

    return await this.categoryDatabaseService.deleteCategory(id)
  }

  async isCategoryExistByQuery(query: FilterQuery<Category>): Promise<boolean> {
    return await this.categoryDatabaseService.isCategoryExistByQuery(query)
  }
}
