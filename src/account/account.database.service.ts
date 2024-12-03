import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, Model, Types } from 'mongoose'

import { ACCOUNT_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
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
    const accountById = await this.accountModel.findById(id).lean()

    if (!accountById) {
      throw new NotFoundError(`Account with id ${id} not found`)
    }

    return accountById
  }

  async getAccountsByUser(options: AccountQueryParamsDto): Promise<Account[]> {
    const filteredOptions = removeUndefined(options)
    return await this.accountModel.find(filteredOptions).lean()
  }

  async updateAccount(
    id: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, {
        new: true,
      })
      .lean()

    if (!updatedAccount) {
      throw new NotFoundError(`Account with id ${id} not found`)
    }

    return updatedAccount
  }

  async deleteAccount(id: Types.ObjectId): Promise<void> {
    const { deletedCount } = await this.accountModel.deleteOne({ _id: id })

    if (deletedCount === 0) {
      throw new NotFoundError(`Account with id ${id} not found`)
    }
  }

  async updateAccountBalanceByAmount(
    id: Types.ObjectId,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    // TODO: - Handle update account balance by amount errors;
    await this.accountModel.findByIdAndUpdate(
      id,
      { $inc: { balance: amount } },
      { session },
    )
  }
}
