import { Injectable } from '@nestjs/common'
import Decimal from 'decimal.js-light'
import { Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { AMOUNT_DECIMAL_PLACES } from '../common/constants/formatting.constants'
import { ValidationError } from '../common/errors/errors'
import { CreateTransferDto } from './dto/create-transfer.dto'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'
import { TransferDatabaseService } from './transfer.database.service'
import { CreateTransferContent, UpdateTransferContent } from './transfer.types'

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
      exchangeRate,
      description,
    } = createTransferDto

    this.validateTransferConsistence(fromAmount, toAmount, exchangeRate)

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
      } = await this.getTransferById(id)
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

        await this.accountService.updateAccountBalanceByAmount(
          fromAccountId,
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
          toAmountDiff,
        )
      }
    }

    return await this.transferDatabaseService.updateTransfer(
      id,
      updateTransferContent,
    )
  }

  async deleteTransfer(id: Types.ObjectId): Promise<void> {
    return await this.transferDatabaseService.deleteTransfer(id)
  }

  private validateTransferConsistence(
    fromAmount: number,
    toAmount: number,
    exchangeRate: number,
  ): void {
    const fromAmountDecimal = new Decimal(fromAmount)
    const toAmountDecimal = new Decimal(toAmount)
    const exchangeRateDecimal = new Decimal(exchangeRate)

    const calculatedToAmount = fromAmountDecimal
      .dividedBy(exchangeRateDecimal)
      .negated()
      .toDecimalPlaces(AMOUNT_DECIMAL_PLACES)

    const isTransferConsistent = calculatedToAmount.equals(toAmountDecimal)

    if (!isTransferConsistent) {
      throw new ValidationError(
        'Transfer amounts are inconsistent with provided exchange rate',
      )
    }
  }
}
