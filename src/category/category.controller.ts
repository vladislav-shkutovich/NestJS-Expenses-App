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
} from '@nestjs/common'

import { CATEGORIES_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { CategoryService } from './category.service'
import { CategoryQueryParamsDto } from './dto/category-query-params.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import type { Category } from './schemas/category.schema'

@Controller(CATEGORIES_ROUTE)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(createCategoryDto)
  }

  @Get(':id')
  async getCategoryById(@Param() params: IdParamDto): Promise<Category> {
    return await this.categoryService.getCategoryById(params.id)
  }

  @Get('/user/:id')
  async getCategorysByUser(
    @Param() params: IdParamDto,
    @Query() query: CategoryQueryParamsDto,
  ): Promise<Category[]> {
    return await this.categoryService.getCategorysByUser(params.id, query)
  }

  @Patch(':id')
  async updateCategory(
    @Param() params: IdParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(
      params.id,
      updateCategoryDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCategory(@Param() params: IdParamDto): Promise<void> {
    return await this.categoryService.deleteCategory(params.id)
  }
}
