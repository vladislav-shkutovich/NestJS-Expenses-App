import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { TRANSFER_MODEL } from '../common/constants/database.constants'
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
    console.error('mock createTransferDto', createTransferDto)
    return {} as Transfer
  }

  async getTransferById(id: Types.ObjectId): Promise<Transfer> {
    console.error('mock id', id)
    return {} as Transfer
  }

  async getTransfersByUser(
    options: TransferQueryParamsDto,
  ): Promise<Transfer[]> {
    console.error('mock options', options)
    return [] as Transfer[]
  }

  async updateTransfer(
    id: Types.ObjectId,
    updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    console.error('mock id', id)
    console.error('mock updateTransferDto', updateTransferDto)
    return {} as Transfer
  }

  async deleteTransfer(id: Types.ObjectId): Promise<void> {
    console.error('mock id', id)
  }
}
