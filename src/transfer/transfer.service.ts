import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { UnprocessableError } from '../common/errors/errors'
import { SummaryService } from '../summary/summary.service'
import { TransactionService } from '../transaction/transaction.service'
import { CreateTransferDto } from './dto/create-transfer.dto'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'
import { TransferDatabaseService } from './transfer.database.service'
import { CreateTransferContent, UpdateTransferContent } from './transfer.types'

@Injectable()
export class TransferService {
  constructor(
    private readonly accountService: AccountService,
    private readonly summaryService: SummaryService,
    private readonly transactionService: TransactionService,
    private readonly transferDatabaseService: TransferDatabaseService,
  ) {}

  // TODO: - Recalculate Summary which affected by Transfer date and amounts on create transfer;
  async createTransfer(
    createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return await this.transactionService.executeInTransaction(async () => {
      const {
        userId,
        from: { accountId: fromAccountId, amount: fromAmount },
        to: { accountId: toAccountId, amount: toAmount },
        exchangeRate,
        description,
      } = createTransferDto

      this.validateTransferConsistence(fromAmount, toAmount, exchangeRate)

      const [
        { currencyCode: fromCurrencyCode, name: fromAccountName },
        { currencyCode: toCurrencyCode, name: toAccountName },
      ] = await Promise.all([
        await this.accountService.updateAccountBalanceByAmount(
          fromAccountId,
          userId,
          fromAmount,
        ),
        await this.accountService.updateAccountBalanceByAmount(
          toAccountId,
          userId,
          toAmount,
        ),
      ])

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
    })
  }

  async getTransfer(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Transfer> {
    return await this.transferDatabaseService.getTransfer(id, userId)
  }

  async getTransfers(options: TransferQueryParamsDto): Promise<Transfer[]> {
    return await this.transferDatabaseService.getTransfers(options)
  }

  // TODO: - Recalculate Summary which affected by Transfer date and amounts on update transfer;
  async updateTransfer(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    return await this.transactionService.executeInTransaction(async () => {
      const { from, to, ...restUpdateTransferParams } = updateTransferDto
      const updateTransferContent: UpdateTransferContent =
        restUpdateTransferParams
      const { exchangeRate } = updateTransferContent

      if (from || to || exchangeRate) {
        const fromAmount = from?.amount
        const toAmount = to?.amount

        const {
          exchangeRate: prevExchangeRate,
          from: prevFrom,
          to: prevTo,
        } = await this.getTransfer(id, userId)
        const { accountId: fromAccountId, amount: prevFromAmount } = prevFrom
        const { accountId: toAccountId, amount: prevToAmount } = prevTo

        this.validateTransferConsistence(
          fromAmount || prevFromAmount,
          toAmount || prevToAmount,
          exchangeRate || prevExchangeRate,
        )

        if (fromAmount) {
          updateTransferContent.from = {
            ...prevFrom,
            amount: fromAmount,
          }

          const fromAmountDiff = fromAmount - prevFromAmount

          // TODO: - Check for operation type change (income or withdrawal) before choosing of totalIncome or totalExpense in summary on transfer update;

          await this.accountService.updateAccountBalanceByAmount(
            fromAccountId,
            userId,
            fromAmountDiff,
          )
        }

        if (toAmount) {
          updateTransferContent.to = {
            ...prevTo,
            amount: toAmount,
          }

          const toAmountDiff = toAmount - prevToAmount

          await this.accountService.updateAccountBalanceByAmount(
            toAccountId,
            userId,
            toAmountDiff,
          )
        }
      }

      return await this.transferDatabaseService.updateTransfer(
        id,
        userId,
        updateTransferContent,
      )
    })
  }

  // TODO: - Recalculate Summary which affected by Transfer amounts on delete transfer;
  async deleteTransfer(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    return await this.transactionService.executeInTransaction(async () => {
      const {
        from: { accountId: fromAccountId, amount: fromAmount },
        to: { accountId: toAccountId, amount: toAmount },
      } = await this.getTransfer(id, userId)

      // "-" sign before the amounts is required, since it is necessary to reduce the accounts balances by its value
      await Promise.all([
        await this.accountService.updateAccountBalanceByAmount(
          toAccountId,
          userId,
          -toAmount,
        ),
        await this.accountService.updateAccountBalanceByAmount(
          fromAccountId,
          userId,
          -fromAmount,
        ),
      ])

      return await this.transferDatabaseService.deleteTransfer(id, userId)
    })
  }

  private validateTransferConsistence(
    fromAmount: number,
    toAmount: number,
    exchangeRate: number,
  ): void {
    const calculatedToAmount = Math.round(-(fromAmount / exchangeRate))

    const isTransferConsistent = calculatedToAmount === toAmount

    if (!isTransferConsistent) {
      throw new UnprocessableError(
        'Transfer amounts are inconsistent with provided exchange rate',
      )
    }
  }
}
