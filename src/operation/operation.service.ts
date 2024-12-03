import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'
import { AccountService } from '../account/account.service'
import { CategoryService } from '../category/category.service'
import { ValidationError } from '../common/errors/errors'
import { CreateOperationDto } from './dto/create-operation.dto'
import { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import { UpdateOperationDto } from './dto/update-operation.dto'
import { OperationDatabaseService } from './operation.database.service'
import type { Operation } from './schemas/operation.schema'

@Injectable()
export class OperationService {
  constructor(
    private readonly operationDatabaseService: OperationDatabaseService,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
  ) {}

  async createOperation(
    createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    // TODO: - Refactor create operation restrictions and logic;
    const { accountId, userId, categoryId, amount } = createOperationDto

    const { currencyCode, userId: accountUserId } =
      await this.accountService.getAccountById(accountId)

    if (!accountUserId.equals(userId)) {
      throw new ValidationError(
        'Selected account userId must be equal to this operation userId',
      )
    }

    await this.checkOperationCategory(categoryId, userId)

    await this.accountService.updateAccountBalanceByAmount(accountId, amount)

    return await this.operationDatabaseService.createOperation({
      ...createOperationDto,
      currencyCode,
    })
  }

  async getOperationById(id: Types.ObjectId): Promise<Operation> {
    return await this.operationDatabaseService.getOperationById(id)
  }

  async getOperationsByUser(
    options: OperationQueryParamsDto,
  ): Promise<Operation[]> {
    return await this.operationDatabaseService.getOperationsByUser(options)
  }

  async updateOperation(
    id: Types.ObjectId,
    updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    const { categoryId, amount } = updateOperationDto
    const {
      accountId,
      userId,
      amount: prevAmount,
    } = await this.getOperationById(id)

    if (categoryId) {
      await this.checkOperationCategory(categoryId, userId)
    }

    if (amount) {
      const amountDiff = amount - prevAmount

      await this.accountService.updateAccountBalanceByAmount(
        accountId,
        amountDiff,
      )
    }

    return await this.operationDatabaseService.updateOperation(
      id,
      updateOperationDto,
    )
  }

  async deleteOperation(id: Types.ObjectId): Promise<void> {
    const { accountId, amount } = await this.getOperationById(id)

    await this.accountService.updateAccountBalanceByAmount(accountId, -amount)

    return await this.operationDatabaseService.deleteOperation(id)
  }

  private async checkOperationCategory(
    operationCategoryId: Types.ObjectId,
    operationUserId: Types.ObjectId,
  ): Promise<void> {
    const { isArchived, userId } =
      await this.categoryService.getCategoryById(operationCategoryId)

    const operationCategoryErrors: string[] = []

    if (isArchived) {
      operationCategoryErrors.push(
        'Selected category for this operation is archived',
      )
    }

    if (!operationUserId.equals(userId)) {
      operationCategoryErrors.push(
        'Selected category userId must be equal to this operation userId',
      )
    }

    if (operationCategoryErrors.length > 0) {
      throw new ValidationError(operationCategoryErrors.join('. '))
    }
  }
}
