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
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
  ): Promise<Category> {
    return await this.categoryService.getCategory(params.id, req.user._id)
  }

  @Get()
  async getCategories(
    @Query() query: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    return await this.categoryService.getCategories(query)
  }

  @Patch(':id')
  async updateCategory(
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(
      params.id,
      req.user._id,
      updateCategoryDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCategory(
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    return await this.categoryService.deleteCategory(params.id, req.user._id)
  }
}
