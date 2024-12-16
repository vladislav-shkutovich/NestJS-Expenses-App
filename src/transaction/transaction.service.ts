import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { runInTransaction } from './transaction.context'

@Injectable()
export class TransactionService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async executeInTransaction<T>(
    transactionCallback: () => Promise<T>,
  ): Promise<T> {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const result = await runInTransaction(transactionCallback, session)
      await session.commitTransaction()

      console.debug('Transaction committed successfully')

      return result
    } catch (error) {
      await session.abortTransaction()

      console.error('Transaction aborted. error: ', error)

      throw error
    } finally {
      session.endSession()
    }
  }
}
