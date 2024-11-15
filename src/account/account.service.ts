import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { NotFoundError, ValidationError } from '../common/errors/errors'
import { UserService } from '../user/user.service'
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
    private readonly userService: UserService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { userId, accountType, isSavings } = createAccountDto

    if (accountType === AccountType.LOAN && isSavings) {
      throw new ValidationError('Loan account type cannot be marked as savings')
    }

    const isUserExist = await this.userService.isUserExistByQuery({
      _id: userId,
    })

    if (!isUserExist) {
      throw new NotFoundError(`User with userId ${userId} not found`)
    }

    return await this.accountDatabaseService.createAccount(createAccountDto)
  }

  async getAccountById(id: Types.ObjectId): Promise<Account> {
    return await this.accountDatabaseService.getAccountById(id)
  }

  async getAccountsByUser(options: AccountQueryParamsDto): Promise<Account[]> {
    const { userId } = options

    const isUserExist = await this.userService.isUserExistByQuery({
      _id: userId,
    })

    if (!isUserExist) {
      throw new NotFoundError(`User with userId ${userId} not found`)
    }

    return await this.accountDatabaseService.getAccountsByUser(options)
  }

  async updateAccount(
    id: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return await this.accountDatabaseService.updateAccount(id, updateAccountDto)
  }

  async deleteAccount(id: Types.ObjectId): Promise<void> {
    return await this.accountDatabaseService.deleteAccount(id)
  }
}
