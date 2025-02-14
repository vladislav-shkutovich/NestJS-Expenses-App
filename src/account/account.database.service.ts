import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { ACCOUNT_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
import { getSession } from '../transaction/transaction.context'
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
    const session = getSession()

    const accountDoc = new this.accountModel(createAccountDto)
    const createdAccount = await accountDoc.save({ session })

    return createdAccount.toObject()
  }

  async getAccount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Account> {
    const account = await this.accountModel
      .findOne({
        _id: id,
        userId,
      })
      .lean()

    if (!account) {
      throw new NotFoundError(`Account with id ${id} not found`)
    }

    return account
  }

  async getAccounts(options: AccountQueryParamsDto): Promise<Account[]> {
    const session = getSession()

    const filteredOptions = removeUndefined(options)

    return await this.accountModel
      .find(filteredOptions, null, { session })
      .lean()
  }

  async updateAccount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const updatedAccount = await this.accountModel
      .findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        updateAccountDto,
        {
          new: true,
        },
      )
      .lean()

    if (!updatedAccount) {
      throw new NotFoundError(`Account with id ${id} not found`)
    }

    return updatedAccount
  }

  async deleteAccount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const { deletedCount } = await this.accountModel.deleteOne({
      _id: id,
      userId,
    })

    if (deletedCount === 0) {
      throw new NotFoundError(`Account with id ${id} not found`)
    }
  }

  async updateAccountBalanceByAmount(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    amount: number,
  ): Promise<Account> {
    const session = getSession()

    const updatedAccount = await this.accountModel.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      { $inc: { balance: amount } },
      { new: true, session },
    )

    if (!updatedAccount) {
      throw new NotFoundError(`Account with id ${id} not found`)
    }

    return updatedAccount
  }
}
