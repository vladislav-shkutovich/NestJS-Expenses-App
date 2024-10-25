import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import { CreateTransferDto } from './dto/create-transfer.dto'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'
import { TransferDatabaseService } from './transfer.database.service'

@Injectable()
export class TransferService {
  constructor(
    private readonly transferDatabaseService: TransferDatabaseService,
  ) {}

  async createTransfer(
    createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return await this.transferDatabaseService.createTransfer(createTransferDto)
  }

  async getTransferById(id: Types.ObjectId): Promise<Transfer> {
    return await this.transferDatabaseService.getTransferById(id)
  }

  async getTransfersByUser(
    userId: Types.ObjectId,
    options: TransferQueryParamsDto,
  ): Promise<Transfer[]> {
    return await this.transferDatabaseService.getTransfersByUser(
      userId,
      options,
    )
  }

  async updateTransfer(
    id: Types.ObjectId,
    updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    return await this.transferDatabaseService.updateTransfer(
      id,
      updateTransferDto,
    )
  }

  async deleteTransfer(id: Types.ObjectId): Promise<void> {
    return await this.transferDatabaseService.deleteTransfer(id)
  }
}
