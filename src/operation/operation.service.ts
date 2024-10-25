import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { CreateOperationDto } from './dto/create-operation.dto'
import { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import { UpdateOperationDto } from './dto/update-operation.dto'
import { OperationDatabaseService } from './operation.database.service'
import type { Operation } from './schemas/operation.schema'

@Injectable()
export class OperationService {
  constructor(
    private readonly operationDatabaseService: OperationDatabaseService,
  ) {}

  async createOperation(
    createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    return await this.operationDatabaseService.createOperation(
      createOperationDto,
    )
  }

  async getOperationById(id: Types.ObjectId): Promise<Operation> {
    return await this.operationDatabaseService.getOperationById(id)
  }

  async getOperationsByUser(
    userId: Types.ObjectId,
    options: OperationQueryParamsDto,
  ): Promise<Operation[]> {
    return await this.operationDatabaseService.getOperationsByUser(
      userId,
      options,
    )
  }

  async updateOperation(
    id: Types.ObjectId,
    updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    return await this.operationDatabaseService.updateOperation(
      id,
      updateOperationDto,
    )
  }

  async deleteOperation(id: Types.ObjectId): Promise<void> {
    return await this.operationDatabaseService.deleteOperation(id)
  }
}
