import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'

import { CATEGORY_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
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
    const categoryById = await this.categoryModel.findById(id).lean()

    if (!categoryById) {
      throw new NotFoundError(`Category with id ${id} not found`)
    }

    return categoryById
  }

  async getCategoriesByUser(
    options: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    const filteredOptions = removeUndefined(options)
    return await this.categoryModel.find(filteredOptions).lean()
  }

  async updateCategory(
    id: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, {
        new: true,
      })
      .lean()

    if (!updatedCategory) {
      throw new NotFoundError(`Category with id ${id} not found`)
    }

    return updatedCategory
  }

  async deleteCategory(id: Types.ObjectId): Promise<void> {
    const { deletedCount } = await this.categoryModel.deleteOne({ _id: id })

    if (deletedCount === 0) {
      throw new NotFoundError(`Category with id ${id} not found`)
    }
  }

  async isCategoryExistByQuery(query: FilterQuery<Category>): Promise<boolean> {
    const category = await this.categoryModel.findOne(query, { _id: 1 })
    return !!category
  }
}
