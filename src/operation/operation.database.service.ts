import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'

import { OPERATION_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
import { getSession } from '../transaction/transaction.context'
import { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import { UpdateOperationDto } from './dto/update-operation.dto'
import { CreateOperationContent, OperationType } from './operation.types'
import type { Operation } from './schemas/operation.schema'

@Injectable()
export class OperationDatabaseService {
  constructor(
    @InjectModel(OPERATION_MODEL) private operationModel: Model<Operation>,
  ) {}

  async createOperation(
    createOperationContent: CreateOperationContent,
  ): Promise<Operation> {
    const session = getSession()

    const operationDoc = new this.operationModel(createOperationContent)
    const createdOperation = await operationDoc.save({ session })

    return createdOperation.toObject()
  }

  async getOperationById(id: Types.ObjectId): Promise<Operation> {
    const operationById = await this.operationModel.findById(id).lean()

    if (!operationById) {
      throw new NotFoundError(`Operation with id ${id} not found`)
    }

    return operationById
  }

  async getOperationsByUser(
    options: OperationQueryParamsDto,
  ): Promise<Operation[]> {
    const { dateFrom, dateTo, type, ...restOptions } = removeUndefined(options)

    const query: FilterQuery<Operation> = {
      ...restOptions,
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { $gte: dateFrom }),
          ...(dateTo && { $lte: dateTo }),
        },
      }),
      ...(type && {
        amount: {
          ...(type === OperationType.INCOME && { $gt: 0 }),
          ...(type === OperationType.WITHDRAWAL && { $lt: 0 }),
        },
      }),
    }

    return await this.operationModel.find(query).lean()
  }

  async updateOperation(
    id: Types.ObjectId,
    updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    const session = getSession()

    const updatedOperation = await this.operationModel
      .findByIdAndUpdate(id, updateOperationDto, {
        new: true,
        session,
      })
      .lean()

    if (!updatedOperation) {
      throw new NotFoundError(`Operation with id ${id} not found`)
    }

    return updatedOperation
  }

  async deleteOperation(id: Types.ObjectId): Promise<void> {
    const session = getSession()

    const { deletedCount } = await this.operationModel.deleteOne(
      { _id: id },
      { session },
    )

    if (deletedCount === 0) {
      throw new NotFoundError(`Operation with id ${id} not found`)
    }
  }

  async isOperationExistByQuery(
    query: FilterQuery<Operation>,
  ): Promise<boolean> {
    const operation = await this.operationModel.findOne(query, { _id: 1 })
    return !!operation
  }
}
