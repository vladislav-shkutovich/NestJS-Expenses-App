import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { ConflictError, UnprocessableError } from '../common/errors/errors'
import { AccountDatabaseService } from './account.database.service'
import { AccountType } from './account.types'
import { AccountQueryParamsDto } from './dto/account-query-params.dto'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import type { Account } from './schemas/account.schema'

@Injectable()
export class AccountService {
  constructor(
    private readonly accountDatabaseService: AccountDatabaseService,
  ) {}

  // TODO: - Recalculate Summary which affected by adding a new Account;
  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { accountType, isSavings } = createAccountDto

    if (accountType === AccountType.LOAN && isSavings) {
      throw new UnprocessableError(
        'Loan account type cannot be marked as savings',
      )
    }

    return await this.accountDatabaseService.createAccount(createAccountDto)
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
