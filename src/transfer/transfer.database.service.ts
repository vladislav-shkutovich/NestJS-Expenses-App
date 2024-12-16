import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'

import { TRANSFER_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
import { CreateTransferDto } from './dto/create-transfer.dto'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'

@Injectable()
export class TransferDatabaseService {
  constructor(
    @InjectModel(TRANSFER_MODEL) private transferModel: Model<Transfer>,
  ) {}

  async createTransfer(
    createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    const transferDoc = new this.transferModel(createTransferDto)
    const createdTransfer = await transferDoc.save()

    return createdTransfer.toObject()
  }

  async getTransferById(id: Types.ObjectId): Promise<Transfer> {
    const transferById = await this.transferModel.findById(id).lean()

    if (!transferById) {
      throw new NotFoundError(`Transfer with id ${id} not found`)
    }

    return transferById
  }

  async getTransfersByUser(
    options: TransferQueryParamsDto,
  ): Promise<Transfer[]> {
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
        from: {
          ...(fromAccountId && { accountId: fromAccountId }),
          ...(fromCurrencyCode && { currencyCode: fromCurrencyCode }),
        },
      }),
      ...((toAccountId || toCurrencyCode) && {
        to: {
          ...(toAccountId && { accountId: toAccountId }),
          ...(toCurrencyCode && { currencyCode: toCurrencyCode }),
        },
      }),
    }

    return await this.transferModel.find(query).lean()
  }

  async updateTransfer(
    id: Types.ObjectId,
    updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    const updatedTransfer = await this.transferModel
      .findByIdAndUpdate(id, updateTransferDto, {
        new: true,
      })
      .lean()

    if (!updatedTransfer) {
      throw new NotFoundError(`Transfer with id ${id} not found`)
    }

    return updatedTransfer
  }

  async deleteTransfer(id: Types.ObjectId): Promise<void> {
    const { deletedCount } = await this.transferModel.deleteOne({ _id: id })

    if (deletedCount === 0) {
      throw new NotFoundError(`Transfer with id ${id} not found`)
    }
  }
}
