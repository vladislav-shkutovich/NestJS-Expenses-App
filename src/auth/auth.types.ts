import { UserWithoutPassword } from '../user/user.types'

export interface UserJwtPayload extends UserWithoutPassword {
  sub?: UserWithoutPassword['_id']
}
