import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'

import { CategoryType } from '../category.types'

export class CategoryQueryParamsDto {
  @IsOptional()
  @IsEnum(CategoryType)
  type: CategoryType

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isArchived?: boolean
}
