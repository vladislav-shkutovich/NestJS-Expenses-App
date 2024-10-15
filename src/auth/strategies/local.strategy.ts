import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { NotFoundError, ValidationError } from '../../common/errors/errors'
import type { UserWithoutPassword } from '../../user/user.types'
import { UserService } from '../../user/user.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super()
  }

  async validate(
    username: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    try {
      const user = await this.userService.getUserByCredentials(
        username,
        password,
      )
      const { password: _password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message)
      }

      if (error instanceof ValidationError) {
        throw new BadRequestException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }
}
