import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { AccountDatabaseService } from './account.database.service'
import { AccountQueryParamsDto } from './dto/account-query-params.dto'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import type { Account } from './schemas/account.schema'

@Injectable()
export class AccountService {
  constructor(
    private readonly accountDatabaseService: AccountDatabaseService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    return await this.accountDatabaseService.createAccount(createAccountDto)
  }

  async getAccountById(id: Types.ObjectId): Promise<Account> {
    return await this.accountDatabaseService.getAccountById(id)
  }

  async getAccountsByUser(
    userId: Types.ObjectId,
    options: AccountQueryParamsDto,
  ): Promise<Account[]> {
    return await this.accountDatabaseService.getAccountsByUser(userId, options)
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
