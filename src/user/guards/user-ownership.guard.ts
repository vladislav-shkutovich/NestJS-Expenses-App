import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { params, user } = context.switchToHttp().getRequest()

    if (params.id && !user?._id?.equals(params.id)) {
      throw new ForbiddenException('Invalid id in request params')
    }

    return true
  }
}
