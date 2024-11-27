import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongoServerError } from 'mongodb'
import { Model, Types } from 'mongoose'

import { CATEGORY_MODEL } from '../common/constants/database.constants'
import {
  ConflictError,
  InternalDatabaseError,
  NotFoundError,
} from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
import { UpdateCategoryOperators } from './category.types'
import { CategoryQueryParamsDto } from './dto/category-query-params.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import type { Category } from './schemas/category.schema'

@Injectable()
export class CategoryDatabaseService {
  constructor(
    @InjectModel(CATEGORY_MODEL) private categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      const createdCategory = await this.categoryModel.create(createCategoryDto)
      return createdCategory.toObject()
    } catch (error) {
      this.handleDatabaseError(error)
    }
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
    updateCategoryOperators: UpdateCategoryOperators,
  ): Promise<Category> {
    try {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryOperators, {
          new: true,
        })
        .lean()

      if (!updatedCategory) {
        throw new NotFoundError(`Category with id ${id} not found`)
      }

      return updatedCategory
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async deleteCategory(id: Types.ObjectId): Promise<void> {
    const { deletedCount } = await this.categoryModel.deleteOne({ _id: id })

    if (deletedCount === 0) {
      throw new NotFoundError(`Category with id ${id} not found`)
    }
  }

  private handleDatabaseError(error: unknown): never {
    console.error(error)

    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictError(
        `Duplicate key error. Document with ${JSON.stringify(error.keyValue)} already exists`,
      )
    }

    throw new InternalDatabaseError()
  }
}
