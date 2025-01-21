import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import type { UserWithoutPassword } from '../../user/user.types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  handleRequest<TUser extends UserWithoutPassword>(error: Error, user: TUser) {
    if (error || !user) {
      console.error('Authorization error:', { error, user })
      throw new UnauthorizedException()
    }
    return user
  }
}
