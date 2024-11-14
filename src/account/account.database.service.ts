import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { ACCOUNT_MODEL } from '../common/constants/database.constants'
import { AccountQueryParamsDto } from './dto/account-query-params.dto'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import type { Account } from './schemas/account.schema'

@Injectable()
export class AccountDatabaseService {
  constructor(
    @InjectModel(ACCOUNT_MODEL) private accountModel: Model<Account>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = await this.accountModel.create(createAccountDto)
    return createdAccount.toObject()
  }

  async getAccountById(id: Types.ObjectId): Promise<Account> {
    console.error('mock id', id)
    return {} as Account
  }

  async getAccountsByUser(options: AccountQueryParamsDto): Promise<Account[]> {
    console.error('mock options', options)
    return [] as Account[]
  }

  async updateAccount(
    id: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    console.error('mock id', id)
    console.error('mock updateAccountDto', updateAccountDto)
    return {} as Account
  }

  async deleteAccount(id: Types.ObjectId): Promise<void> {
    console.error('mock id', id)
  }
}
