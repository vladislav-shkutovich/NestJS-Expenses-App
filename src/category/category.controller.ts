import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import type { Request as ExpressRequest } from 'express'

import { CATEGORIES_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { UserIdOwnershipGuard } from '../common/guards/user-id-ownership.guard'
import { CategoryService } from './category.service'
import { CategoryQueryParamsDto } from './dto/category-query-params.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import type { Category } from './schemas/category.schema'

@Controller(CATEGORIES_ROUTE)
@UseGuards(UserIdOwnershipGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(createCategoryDto)
  }

  @Get(':id')
  async getCategory(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
  ): Promise<Category> {
    return await this.categoryService.getCategory(id, userId)
  }

  @Get()
  async getCategories(
    @Query() query: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    return await this.categoryService.getCategories(query)
  }

  @Patch(':id')
  async updateCategory(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(
      id,
      userId,
      updateCategoryDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCategory(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
  ): Promise<void> {
    return await this.categoryService.deleteCategory(id, userId)
  }
}
