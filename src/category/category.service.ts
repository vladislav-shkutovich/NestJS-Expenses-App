import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { NotFoundError } from '../common/errors/errors'
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
    const { userId } = createCategoryDto

    const isUserExist = await this.userService.isUserExistByQuery({
      _id: userId,
    })

    if (!isUserExist) {
      throw new NotFoundError(`User with userId ${userId} not found`)
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
    return await this.categoryDatabaseService.updateCategory(
      id,
      updateCategoryDto,
    )
  }

  async deleteCategory(id: Types.ObjectId): Promise<void> {
    return await this.categoryDatabaseService.deleteCategory(id)
  }
}
