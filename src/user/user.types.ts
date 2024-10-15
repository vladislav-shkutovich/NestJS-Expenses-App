import type { User } from './schemas/user.schema'

export type UserWithoutPassword = Omit<User, 'password'>
