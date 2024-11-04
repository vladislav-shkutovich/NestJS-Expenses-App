import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Document, FilterQuery, Model, Types } from 'mongoose'

import { USER_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import type { User } from './schemas/user.schema'
import type { UserWithoutPassword } from './user.types'

@Injectable()
export class UserDatabaseService {
  constructor(@InjectModel(USER_MODEL) private userModel: Model<User>) {}

  private sanitizeUserDocument(user: Document): UserWithoutPassword {
    return user.toObject({
      transform: function (_doc, ret) {
        delete ret.password
        return ret
      },
    })
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const createdUser = await this.userModel.create(createUserDto)
    return this.sanitizeUserDocument(createdUser)
  }

  async getUserById(id: Types.ObjectId): Promise<UserWithoutPassword> {
    const userById = await this.userModel.findById(id)

    if (!userById) {
      throw new NotFoundError(`User with id ${id} not found`)
    }

    return this.sanitizeUserDocument(userById)
  }

  async updateUser(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    )

    if (!updatedUser) {
      throw new NotFoundError(`User with id ${id} not found`)
    }

    return this.sanitizeUserDocument(updatedUser)
  }

  async deleteUser(id: Types.ObjectId): Promise<void> {
    const deletedUser = await this.userModel.findByIdAndDelete(id)

    if (!deletedUser) {
      throw new NotFoundError(`User with id ${id} not found`)
    }
  }

  async isUserExistByQuery(query: FilterQuery<User>): Promise<boolean> {
    const user = await this.userModel.findOne(query, { _id: 1 })
    return !!user
  }

  async findUserByQuery(query: FilterQuery<User>): Promise<User | null> {
    return await this.userModel.findOne(query).lean()
  }
}
