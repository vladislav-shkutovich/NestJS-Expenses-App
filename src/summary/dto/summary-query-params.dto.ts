import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'

export class SummaryQueryParamsDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date
}
