import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { CategoryType } from '../category.types'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(CategoryType)
  type: CategoryType

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean
}
