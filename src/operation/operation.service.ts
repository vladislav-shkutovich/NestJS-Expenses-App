import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { FilterQuery, Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { CategoryService } from '../category/category.service'
import { ValidationError } from '../common/errors/errors'
import { TransactionService } from '../transaction/transaction.service'
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
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly transactionService: TransactionService,
  ) {}

  // TODO: - Recalculate Summary which affected by Operation date and amount on create operation;
  async createOperation(
    createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    return this.transactionService.executeInTransaction(async () => {
      const { accountId, userId, categoryId, amount } = createOperationDto

      const { currencyCode, userId: accountUserId } =
        await this.accountService.updateAccountBalanceByAmount(
          accountId,
          amount,
        )

      if (!userId.equals(accountUserId)) {
        throw new ValidationError(
          'Specified in operation userId must match a userId in specified account',
        )
      }

      await this.validateOperationCategory(categoryId, userId)

      return await this.operationDatabaseService.createOperation({
        ...createOperationDto,
        currencyCode,
      })
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

  // TODO: - Recalculate Summary which affected by Operation date and amount on update operation;
  async updateOperation(
    id: Types.ObjectId,
    updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    return this.transactionService.executeInTransaction(async () => {
      const { categoryId, amount } = updateOperationDto

      if (categoryId || amount) {
        const {
          accountId,
          userId,
          amount: prevAmount,
        } = await this.getOperationById(id)

        if (categoryId) {
          await this.validateOperationCategory(categoryId, userId)
        }

        if (amount) {
          const amountDiff = amount - prevAmount

          await this.accountService.updateAccountBalanceByAmount(
            accountId,
            amountDiff,
          )
        }
      }

      return await this.operationDatabaseService.updateOperation(
        id,
        updateOperationDto,
      )
    })
  }

  // TODO: - Recalculate Summary which affected by Operation amount on delete operation;
  async deleteOperation(id: Types.ObjectId): Promise<void> {
    return this.transactionService.executeInTransaction(async () => {
      const { accountId, amount } = await this.getOperationById(id)

      // "-" sign before amount is required, since it's necessary to reduce the account balance by its value
      await this.accountService.updateAccountBalanceByAmount(accountId, -amount)

      return await this.operationDatabaseService.deleteOperation(id)
    })
  }

  private async validateOperationCategory(
    operationCategoryId: Types.ObjectId,
    operationUserId: Types.ObjectId,
  ): Promise<void> {
    const { isArchived, userId } =
      await this.categoryService.getCategoryById(operationCategoryId)

    const operationCategoryErrors: string[] = []

    if (isArchived) {
      operationCategoryErrors.push(
        'Specified category for this operation is archived',
      )
    }

    if (!operationUserId.equals(userId)) {
      operationCategoryErrors.push(
        'Specified in operation userId must match a userId in specified category',
      )
    }

    if (operationCategoryErrors.length > 0) {
      throw new ValidationError(operationCategoryErrors.join('. '))
    }
  }

  async isOperationExistByQuery(
    query: FilterQuery<Operation>,
  ): Promise<boolean> {
    return await this.operationDatabaseService.isOperationExistByQuery(query)
  }
}
