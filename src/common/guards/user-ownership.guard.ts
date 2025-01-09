import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { body, query, user } = context.switchToHttp().getRequest()

    if (body && body.userId && !user._id.equals(body.userId)) {
      throw new ForbiddenException('Invalid userId in request body')
    }

    if (body && query.userId && !user._id.equals(query.userId)) {
      throw new ForbiddenException('Invalid userId in query parameters')
    }

    return true
  }
}
