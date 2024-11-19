import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CATEGORY_MODEL } from '../common/constants/database.constants'
import { CategoryQueryParamsDto } from './dto/category-query-params.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import type { Category } from './schemas/category.schema'

@Injectable()
export class CategoryDatabaseService {
  constructor(
    @InjectModel(CATEGORY_MODEL) private categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const createdCategory = await this.categoryModel.create(createCategoryDto)
    return createdCategory.toObject()
  }

  async getCategoryById(id: Types.ObjectId): Promise<Category> {
    console.error('mock id', id)
    return {} as Category
  }

  async getCategoriesByUser(
    options: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    console.error('mock options', options)
    return [] as Category[]
  }

  async updateCategory(
    id: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    console.error('mock id', id)
    console.error('mock updateCategoryDto', updateCategoryDto)
    return {} as Category
  }

  async deleteCategory(id: Types.ObjectId): Promise<void> {
    console.error('mock id', id)
  }
}
