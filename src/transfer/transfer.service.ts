import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { UnprocessableError } from '../common/errors/errors'
import { SummaryService } from '../summary/summary.service'
import { TransactionService } from '../transaction/transaction.service'
import type { CreateTransferDto } from './dto/create-transfer.dto'
import type { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import type { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'
import { TransferDatabaseService } from './transfer.database.service'
import type {
  CreateTransferContent,
  UpdateTransferContent,
} from './transfer.types'

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
        date,
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

      await Promise.all([
        await this.summaryService.processSummariesOnTransferCreateDelete({
          accountId: fromAccountId,
          currencyCode: fromCurrencyCode,
          date,
          amount: fromAmount,
        }),
        await this.summaryService.processSummariesOnTransferCreateDelete({
          accountId: toAccountId,
          currencyCode: toCurrencyCode,
          date,
          amount: toAmount,
        }),
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
          description ?? `Transfer from ${fromAccountName} to ${toAccountName}`,
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
  // TODO: - Check for operation type change (income or withdrawal) before choosing of totalIncome or totalExpense in summary on transfer update;
  // TODO: - Try to refactor `updateTransfer` method to reduce its complexity;
  async updateTransfer(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    return await this.transactionService.executeInTransaction(async () => {
      const { from, to, ...restUpdateTransferParams } = updateTransferDto
      const updateTransferContent: UpdateTransferContent =
        restUpdateTransferParams
      const { exchangeRate, date } = updateTransferContent

      if (from || to || exchangeRate || date) {
        const fromAmount = from?.amount
        const toAmount = to?.amount

        const {
          exchangeRate: prevExchangeRate,
          from: prevFrom,
          to: prevTo,
          date: prevDate,
        } = await this.getTransfer(id, userId)
        const {
          accountId: fromAccountId,
          currencyCode: fromCurrencyCode,
          amount: prevFromAmount,
        } = prevFrom
        const {
          accountId: toAccountId,
          currencyCode: toCurrencyCode,
          amount: prevToAmount,
        } = prevTo

        this.validateTransferConsistence(
          fromAmount ?? prevFromAmount,
          toAmount ?? prevToAmount,
          exchangeRate ?? prevExchangeRate,
        )

        if (fromAmount || date) {
          if (fromAmount) {
            updateTransferContent.from = {
              ...prevFrom,
              amount: fromAmount,
            }

            const fromAmountDiff = fromAmount - prevFromAmount

            await this.accountService.updateAccountBalanceByAmount(
              fromAccountId,
              userId,
              fromAmountDiff,
            )
          }

          await this.summaryService.processSummariesOnTransferUpdate({
            accountId: fromAccountId,
            currencyCode: fromCurrencyCode,
            prevAmount: prevFromAmount,
            nextAmount: fromAmount ?? prevFromAmount,
            prevDate,
            nextDate: date ?? prevDate,
          })
        }

        if (toAmount || date) {
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

          await this.summaryService.processSummariesOnTransferUpdate({
            accountId: toAccountId,
            currencyCode: toCurrencyCode,
            prevAmount: prevToAmount,
            nextAmount: toAmount ?? prevToAmount,
            prevDate,
            nextDate: date ?? prevDate,
          })
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
        from: {
          accountId: fromAccountId,
          amount: fromAmount,
          currencyCode: fromCurrencyCode,
        },
        to: {
          accountId: toAccountId,
          amount: toAmount,
          currencyCode: toCurrencyCode,
        },
        date,
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

      await Promise.all([
        await this.summaryService.processSummariesOnTransferCreateDelete({
          accountId: fromAccountId,
          currencyCode: fromCurrencyCode,
          date,
          amount: -fromAmount,
        }),
        await this.summaryService.processSummariesOnTransferCreateDelete({
          accountId: toAccountId,
          currencyCode: toCurrencyCode,
          date,
          amount: -toAmount,
        }),
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
