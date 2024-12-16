import { AsyncLocalStorage } from 'async_hooks'
import { ClientSession } from 'mongoose'

const asyncLocalStorage = new AsyncLocalStorage<ClientSession>()

export const runInTransaction = async <T>(
  callback: () => Promise<T>,
  session: ClientSession,
): Promise<T> => {
  return asyncLocalStorage.run(session, callback)
}

export const getSession = (): ClientSession | undefined => {
  return asyncLocalStorage.getStore()
}
