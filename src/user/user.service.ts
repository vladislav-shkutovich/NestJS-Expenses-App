import { Injectable } from '@nestjs/common'
import { FilterQuery, Types } from 'mongoose'
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../common/errors/errors'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import type { User } from './schemas/user.schema'
import { UserDatabaseService } from './user.database.service'
import type { UserWithoutPassword } from './user.types'

const scryptAsync = promisify(scrypt)

@Injectable()
export class UserService {
  constructor(private readonly userDatabaseService: UserDatabaseService) {}
  private readonly keyLength = 64

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex')
    const derivedKey = await scryptAsync(password, salt, this.keyLength)
    return `${salt}.${(derivedKey as Buffer).toString('hex')}`
  }

  private async comparePasswords(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const [salt, hashKey] = hashPassword.split('.')
    const hashKeyBuff = Buffer.from(hashKey, 'hex')
    const derivedKey = await scryptAsync(password, salt, this.keyLength)
    return timingSafeEqual(hashKeyBuff, derivedKey as Buffer)
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const isDuplicate = await this.isUserExistByQuery({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    })

    if (isDuplicate) {
      throw new ConflictError(
        `User with username ${createUserDto.username} or email ${createUserDto.email} already exists`,
      )
    }

    const hashedPassword = await this.hashPassword(createUserDto.password)

    return await this.userDatabaseService.createUser({
      ...createUserDto,
      password: hashedPassword,
    })
  }

  async getUserById(id: Types.ObjectId): Promise<UserWithoutPassword> {
    return await this.userDatabaseService.getUserById(id)
  }

  async getUserByCredentials(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userDatabaseService.findUserByQuery({ username })

    if (!user) {
      throw new NotFoundError(`User with username ${username} not found`)
    }

    const isPasswordMatch = await this.comparePasswords(password, user.password)

    if (!isPasswordMatch) {
      throw new ValidationError('Wrong password')
    }

    return user
  }

  async updateUser(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const updateParams = { ...updateUserDto }

    if (updateUserDto.password) {
      updateParams.password = await this.hashPassword(updateUserDto.password)
    }

    return await this.userDatabaseService.updateUser(id, updateParams)
  }

  async deleteUser(id: Types.ObjectId): Promise<void> {
    return await this.userDatabaseService.deleteUser(id)
  }

  async isUserExistByQuery(query: FilterQuery<User>): Promise<boolean> {
    return await this.userDatabaseService.isUserExistByQuery(query)
  }
}
