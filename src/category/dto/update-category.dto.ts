import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { CategoryType } from '../category.types'

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean
}
