import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { OPERATION_MODEL } from '../common/constants/database.constants'
import { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import { UpdateOperationDto } from './dto/update-operation.dto'
import type { CreateOperationContent } from './operation.types'
import type { Operation } from './schemas/operation.schema'

@Injectable()
export class OperationDatabaseService {
  constructor(
    @InjectModel(OPERATION_MODEL) private operationModel: Model<Operation>,
  ) {}

  async createOperation(
    createOperationContent: CreateOperationContent,
  ): Promise<Operation> {
    const createdOperation = await this.operationModel.create(
      createOperationContent,
    )
    return createdOperation.toObject()
  }

  async getOperationById(id: Types.ObjectId): Promise<Operation> {
    console.error('mock id', id)
    return {} as Operation
  }

  async getOperationsByUser(
    options: OperationQueryParamsDto,
  ): Promise<Operation[]> {
    console.error('mock options', options)
    return [] as Operation[]
  }

  async updateOperation(
    id: Types.ObjectId,
    updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    console.error('mock id', id)
    console.error('mock updateOperationDto', updateOperationDto)
    return {} as Operation
  }

  async deleteOperation(id: Types.ObjectId): Promise<void> {
    console.error('mock id', id)
  }
}
