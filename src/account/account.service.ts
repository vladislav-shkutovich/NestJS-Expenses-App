import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import { ConflictError, UnprocessableError } from '../common/errors/errors'
import { SummaryService } from '../summary/summary.service'
import { TransactionService } from '../transaction/transaction.service'
import { AccountDatabaseService } from './account.database.service'
import { AccountType } from './account.types'
import type { AccountQueryParamsDto } from './dto/account-query-params.dto'
import type { CreateAccountDto } from './dto/create-account.dto'
import type { UpdateAccountDto } from './dto/update-account.dto'
import type { Account } from './schemas/account.schema'

@Injectable()
export class AccountService {
  constructor(
    private readonly accountDatabaseService: AccountDatabaseService,
    @Inject(forwardRef(() => SummaryService))
    private readonly summaryService: SummaryService,
    private readonly transactionService: TransactionService,
  ) {}

  // TODO: - Recalculate Summary which affected by adding a new Account;
  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    return await this.transactionService.executeInTransaction(async () => {
      const { userId, accountType, isSavings } = createAccountDto

      if (accountType === AccountType.LOAN && isSavings) {
        throw new UnprocessableError(
          'Loan account type cannot be marked as savings',
        )
      }

      const createdAccount =
        await this.accountDatabaseService.createAccount(createAccountDto)

      const { _id: accountId, createdAt, currencyCode } = createdAccount

      await this.summaryService.processSummariesOnAccountCreate({
        userId,
        accountId,
        createdAt,
        currencyCode,
      })

      return createdAccount
    })
  }

  async getAccount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Account> {
    return await this.accountDatabaseService.getAccount(id, userId)
  }

  async getAccounts(options: AccountQueryParamsDto): Promise<Account[]> {
    return await this.accountDatabaseService.getAccounts(options)
  }

  async updateAccount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const { accountType } = await this.getAccount(id, userId)

    if (accountType === AccountType.LOAN && updateAccountDto.accountType) {
      throw new UnprocessableError(
        'Changing the account type for loan accounts is not possible',
      )
    }

    return await this.accountDatabaseService.updateAccount(
      id,
      userId,
      updateAccountDto,
    )
  }

  async deleteAccount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const { balance } = await this.getAccount(id, userId)

    if (balance !== 0) {
      throw new ConflictError(
        'Account with a non-zero balance cannot be deleted. You must clear the account first by transferring funds from it',
      )
    }

    return await this.accountDatabaseService.deleteAccount(id, userId)
  }

  async updateAccountBalanceByAmount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    amount: number,
  ): Promise<Account> {
    return await this.accountDatabaseService.updateAccountBalanceByAmount(
      id,
      userId,
      amount,
    )
  }
}
