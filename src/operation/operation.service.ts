import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { FilterQuery, Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { CategoryService } from '../category/category.service'
import { UnprocessableError } from '../common/errors/errors'
import { SummaryService } from '../summary/summary.service'
import { TransactionService } from '../transaction/transaction.service'
import type { CreateOperationDto } from './dto/create-operation.dto'
import type { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import type { UpdateOperationDto } from './dto/update-operation.dto'
import { OperationDatabaseService } from './operation.database.service'
import type { Operation } from './schemas/operation.schema'

@Injectable()
export class OperationService {
  constructor(
    private readonly accountService: AccountService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly operationDatabaseService: OperationDatabaseService,
    private readonly summaryService: SummaryService,
    private readonly transactionService: TransactionService,
  ) {}

  // TODO: - Recalculate Summary which affected by Operation date and amount on create operation;
  async createOperation(
    createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    return await this.transactionService.executeInTransaction(async () => {
      const { accountId, userId, categoryId, amount, date } = createOperationDto

      await this.validateOperationCategory(categoryId, userId)

      const { currencyCode } =
        await this.accountService.updateAccountBalanceByAmount(
          accountId,
          userId,
          amount,
        )

      await this.summaryService.processSummariesOnOperationCreateDelete({
        accountId,
        currencyCode,
        date,
        amount,
      })

      return await this.operationDatabaseService.createOperation({
        ...createOperationDto,
        currencyCode,
      })
    })
  }

  async getOperation(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Operation> {
    return await this.operationDatabaseService.getOperation(id, userId)
  }

  async getOperations(options: OperationQueryParamsDto): Promise<Operation[]> {
    return await this.operationDatabaseService.getOperations(options)
  }

  // TODO: - Recalculate Summary which affected by Operation date and amount on update operation;
  // TODO: - Check for operation type change (income or withdrawal) before choosing of totalIncome or totalExpense in summary on operation update;
  async updateOperation(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateOperationDto: UpdateOperationDto,
  ): Promise<Operation> {
    return await this.transactionService.executeInTransaction(async () => {
      const { categoryId, amount, date } = updateOperationDto

      if (categoryId) {
        await this.validateOperationCategory(categoryId, userId)
      }

      if (amount || date) {
        const {
          accountId,
          currencyCode,
          date: prevDate,
          amount: prevAmount,
        } = await this.getOperation(id, userId)

        const amountDiff = amount ? amount - prevAmount : 0

        if (amountDiff) {
          await this.accountService.updateAccountBalanceByAmount(
            accountId,
            userId,
            amountDiff,
          )
        }

        await this.summaryService.processSummariesOnOperationUpdate({
          accountId,
          currencyCode,
          prevAmount,
          nextAmount: amount ?? prevAmount,
          prevDate,
          nextDate: date ?? prevDate,
        })
      }

      return await this.operationDatabaseService.updateOperation(
        id,
        userId,
        updateOperationDto,
      )
    })
  }

  // TODO: - Recalculate Summary which affected by Operation amount on delete operation;
  async deleteOperation(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    return await this.transactionService.executeInTransaction(async () => {
      const { accountId, currencyCode, amount, date } = await this.getOperation(
        id,
        userId,
      )

      // "-" sign before amounts is required, since it's necessary to reduce the account balance by its value

      await this.accountService.updateAccountBalanceByAmount(
        accountId,
        userId,
        -amount,
      )

      await this.summaryService.processSummariesOnOperationCreateDelete({
        accountId,
        currencyCode,
        date,
        amount: -amount,
      })

      return await this.operationDatabaseService.deleteOperation(id, userId)
    })
  }

  private async validateOperationCategory(
    operationCategoryId: Types.ObjectId,
    operationUserId: Types.ObjectId,
  ): Promise<void> {
    const { isArchived } = await this.categoryService.getCategory(
      operationCategoryId,
      operationUserId,
    )

    if (isArchived) {
      throw new UnprocessableError(
        'Specified category for this operation is archived',
      )
    }
  }

  async isOperationExistByQuery(
    query: FilterQuery<Operation>,
  ): Promise<boolean> {
    return await this.operationDatabaseService.isOperationExistByQuery(query)
  }
}
