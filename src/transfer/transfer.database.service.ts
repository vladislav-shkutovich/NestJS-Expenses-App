import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'

import { TRANSFER_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
import { getSession } from '../transaction/transaction.context'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import type { Transfer } from './schemas/transfer.schema'
import { CreateTransferContent, UpdateTransferContent } from './transfer.types'

@Injectable()
export class TransferDatabaseService {
  constructor(
    @InjectModel(TRANSFER_MODEL) private transferModel: Model<Transfer>,
  ) {}

  async createTransfer(
    createTransferContent: CreateTransferContent,
  ): Promise<Transfer> {
    const session = getSession()

    const transferDoc = new this.transferModel(createTransferContent)
    const createdTransfer = await transferDoc.save({ session })

    return createdTransfer.toObject()
  }

  async getTransfer(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Transfer> {
    const transfer = await this.transferModel
      .findOne({
        _id: id,
        userId,
      })
      .lean()

    if (!transfer) {
      throw new NotFoundError(`Transfer with id ${id} not found`)
    }

    return transfer
  }

  async getTransfers(options: TransferQueryParamsDto): Promise<Transfer[]> {
    const {
      dateFrom,
      dateTo,
      fromAccountId,
      toAccountId,
      fromCurrencyCode,
      toCurrencyCode,
      ...restOptions
    } = removeUndefined(options)

    const query: FilterQuery<Transfer> = {
      ...restOptions,
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { $gte: dateFrom }),
          ...(dateTo && { $lte: dateTo }),
        },
      }),
      ...((fromAccountId || fromCurrencyCode) && {
        ...(fromAccountId && { 'from.accountId': fromAccountId }),
        ...(fromCurrencyCode && { 'from.currencyCode': fromCurrencyCode }),
      }),
      ...((toAccountId || toCurrencyCode) && {
        ...(toAccountId && { 'to.accountId': toAccountId }),
        ...(toCurrencyCode && { 'to.currencyCode': toCurrencyCode }),
      }),
    }

    return await this.transferModel.find(query).lean()
  }

  async updateTransfer(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateTransferDto: UpdateTransferContent,
  ): Promise<Transfer> {
    const session = getSession()

    const updatedTransfer = await this.transferModel
      .findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        updateTransferDto,
        {
          new: true,
          session,
        },
      )
      .lean()

    if (!updatedTransfer) {
      throw new NotFoundError(`Transfer with id ${id} not found`)
    }

    return updatedTransfer
  }

  async deleteTransfer(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const session = getSession()

    const { deletedCount } = await this.transferModel.deleteOne(
      { _id: id, userId },
      { session },
    )

    if (deletedCount === 0) {
      throw new NotFoundError(`Transfer with id ${id} not found`)
    }
  }
}
