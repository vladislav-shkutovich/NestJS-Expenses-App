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

import { OPERATIONS_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { CreateOperationDto } from './dto/create-operation.dto'
import { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import { UpdateOperationDto } from './dto/update-operation.dto'
import { OperationService } from './operation.service'
import type { Operation } from './schemas/operation.schema'

@Controller(OPERATIONS_ROUTE)
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  async createOperation(
    @Body() createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    return await this.operationService.createOperation(createOperationDto)
  }

  @Get(':id')
  async getOperationById(@Param() params: IdParamDto): Promise<Operation> {
    return await this.operationService.getOperationById(params.id)
  }

  @Get('/user/:id')
  async getOperationsByUser(
    @Param() params: IdParamDto,
    @Query() query: OperationQueryParamsDto,
  ): Promise<Operation[]> {
    return await this.operationService.getOperationsByUser(params.id, query)
  }

  @Patch(':id')
  async updateOperation(
    @Param() params: IdParamDto,
    @Body() updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    return await this.operationService.updateOperation(
      params.id,
      updateOperationDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteOperation(@Param() params: IdParamDto): Promise<void> {
    return await this.operationService.deleteOperation(params.id)
  }
}
