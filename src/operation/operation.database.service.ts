import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, FilterQuery, Model, Types } from 'mongoose'

import { OPERATION_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
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
    session?: ClientSession,
  ): Promise<Operation> {
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
    const query: FilterQuery<Operation> = restOptions

    if (dateFrom || dateTo) {
      query.date = {}

      if (dateFrom) {
        query.date.$gte = dateFrom
      }

      if (dateTo) {
        query.date.$lte = dateTo
      }
    }

    if (type) {
      if (type === OperationType.INCOME) {
        query.amount = { $gt: 0 }
      }

      if (type === OperationType.WITHDRAWAL) {
        query.amount = { $lt: 0 }
      }
    }

    return await this.operationModel.find(query).lean()
  }

  async updateOperation(
    id: Types.ObjectId,
    updateOperationDto: UpdateOperationDto,
    session: ClientSession,
  ): Promise<Operation> {
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

  async deleteOperation(
    id: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
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
