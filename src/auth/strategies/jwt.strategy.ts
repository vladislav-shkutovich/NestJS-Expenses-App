import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { throwMissingEnvVar } from '../../common/utils/env.utils'
import type { UserWithoutPassword } from '../../user/user.types'
import type { UserJwtPayload } from '../auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        throwMissingEnvVar('JWT_SECRET'),
    })
  }

  validate(payload: UserJwtPayload): UserWithoutPassword {
    const payloadClone = globalThis.structuredClone(payload)
    delete payloadClone.sub
    return payloadClone
  }
}
