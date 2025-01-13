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

import { OPERATIONS_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { UserIdOwnershipGuard } from '../common/guards/user-id-ownership.guard'
import { CreateOperationDto } from './dto/create-operation.dto'
import { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import { UpdateOperationDto } from './dto/update-operation.dto'
import { OperationService } from './operation.service'
import type { Operation } from './schemas/operation.schema'

@Controller(OPERATIONS_ROUTE)
@UseGuards(UserIdOwnershipGuard)
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  async createOperation(
    @Body() createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    return await this.operationService.createOperation(createOperationDto)
  }

  @Get(':id')
  async getOperation(
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
  ): Promise<Operation> {
    return await this.operationService.getOperation(params.id, req.user._id)
  }

  @Get()
  async getOperations(
    @Query() query: OperationQueryParamsDto,
  ): Promise<Operation[]> {
    return await this.operationService.getOperations(query)
  }

  @Patch(':id')
  async updateOperation(
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
    @Body() updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    return await this.operationService.updateOperation(
      params.id,
      req.user._id,
      updateOperationDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteOperation(
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    return await this.operationService.deleteOperation(params.id, req.user._id)
  }
}
