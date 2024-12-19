import { ClientSession } from 'mongoose'
import { AsyncLocalStorage } from 'node:async_hooks'

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
