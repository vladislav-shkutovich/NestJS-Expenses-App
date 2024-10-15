import type { UserWithoutPassword } from '../../src/user/user.types'

declare module 'express' {
  interface Request {
    user: UserWithoutPassword
  }
}
