import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { FilterQuery, Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { CategoryService } from '../category/category.service'
import { UnprocessableError } from '../common/errors/errors'
import { SummaryService } from '../summary/summary.service'
import { TransactionService } from '../transaction/transaction.service'
import { CreateOperationDto } from './dto/create-operation.dto'
import { OperationQueryParamsDto } from './dto/operation-query-params.dto'
import { UpdateOperationDto } from './dto/update-operation.dto'
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

      const { currencyCode } =
        await this.accountService.updateAccountBalanceByAmount(
          accountId,
          userId,
          amount,
        )

      await this.validateOperationCategory(categoryId, userId)

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
      const { categoryId, amount } = updateOperationDto

      if (categoryId || amount) {
        const { accountId, amount: prevAmount } = await this.getOperation(
          id,
          userId,
        )

        if (categoryId) {
          await this.validateOperationCategory(categoryId, userId)
        }

        if (amount) {
          const amountDiff = amount - prevAmount

          // TODO: - Check for operation type change (income or withdrawal) before choosing of totalIncome or totalExpense in summary on operation update;

          await this.accountService.updateAccountBalanceByAmount(
            accountId,
            userId,
            amountDiff,
          )
        }
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
      const { accountId, amount, date } = await this.getOperation(id, userId)

      // "-" sign before amounts is required, since it's necessary to reduce the account balance by its value

      const { currencyCode } =
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
