import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { ValidationError } from '../common/errors/errors'
import { CreateTransferDto } from './dto/create-transfer.dto'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'
import { TransferDatabaseService } from './transfer.database.service'
import { CreateTransferContent } from './transfer.types'

@Injectable()
export class TransferService {
  constructor(
    private readonly transferDatabaseService: TransferDatabaseService,
    private readonly accountService: AccountService,
  ) {}

  async createTransfer(
    createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    const {
      userId,
      from: { accountId: fromAccountId, amount: fromAmount },
      to: { accountId: toAccountId, amount: toAmount },
      description,
    } = createTransferDto

    const [
      {
        currencyCode: fromCurrencyCode,
        userId: fromAccountUserId,
        name: fromAccountName,
      },
      {
        currencyCode: toCurrencyCode,
        userId: toAccountUserId,
        name: toAccountName,
      },
    ] = await Promise.all([
      this.accountService.updateAccountBalanceByAmount(
        fromAccountId,
        fromAmount,
      ),
      this.accountService.updateAccountBalanceByAmount(toAccountId, toAmount),
    ])

    if (!userId.equals(fromAccountUserId) || !userId.equals(toAccountUserId)) {
      throw new ValidationError(
        'Specified in transfer userId must match a userId in both specified accounts',
      )
    }

    const createTransferContent: CreateTransferContent = {
      ...createTransferDto,
      from: {
        ...createTransferDto.from,
        currencyCode: fromCurrencyCode,
      },
      to: {
        ...createTransferDto.to,
        currencyCode: toCurrencyCode,
      },
      description:
        description || `Transfer from ${fromAccountName} to ${toAccountName}`,
    }

    return await this.transferDatabaseService.createTransfer(
      createTransferContent,
    )
  }

  async getTransferById(id: Types.ObjectId): Promise<Transfer> {
    return await this.transferDatabaseService.getTransferById(id)
  }

  async getTransfersByUser(
    options: TransferQueryParamsDto,
  ): Promise<Transfer[]> {
    return await this.transferDatabaseService.getTransfersByUser(options)
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
