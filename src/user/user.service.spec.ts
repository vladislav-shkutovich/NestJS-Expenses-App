import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'

import { ConflictError, ValidationError } from '../common/errors/errors'
import { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import { User } from './schemas/user.schema'
import { UserDatabaseService } from './user.database.service'
import { UserService } from './user.service'

describe('UserService', () => {
  let userService: UserService
  let userDatabaseService: DeepMocked<UserDatabaseService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserDatabaseService,
          useValue: createMock<UserDatabaseService>(),
        },
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    userDatabaseService =
      module.get<DeepMocked<UserDatabaseService>>(UserDatabaseService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('createUser()', () => {
    const enteredUser: CreateUserDto = {
      username: 'username',
      password: 'password',
      email: 'email',
    }
    const hashedPassword = 'hashed_password'

    it('should throw ConflictError if user already exists', async () => {
      userDatabaseService.isUserExistByQuery = jest.fn().mockResolvedValue(true)
      userService['hashPassword'] = jest.fn()

      await expect(userService.createUser(enteredUser)).rejects.toThrow(
        ConflictError,
      )
      expect(userDatabaseService.isUserExistByQuery).toHaveBeenCalledWith({
        $or: [{ username: enteredUser.username }, { email: enteredUser.email }],
      })
      expect(userDatabaseService.createUser).not.toHaveBeenCalled()
      expect(userService['hashPassword']).not.toHaveBeenCalled()
    })

    it('should call method with correct arguments if user does not exist', async () => {
      userDatabaseService.isUserExistByQuery = jest
        .fn()
        .mockResolvedValue(false)
      userService['hashPassword'] = jest.fn().mockResolvedValue(hashedPassword)
      await userService.createUser(enteredUser)

      expect(userDatabaseService.isUserExistByQuery).toHaveBeenCalledWith({
        $or: [{ username: enteredUser.username }, { email: enteredUser.email }],
      })
      expect(userService['hashPassword']).toHaveBeenCalledWith(
        enteredUser.password,
      )
      expect(userDatabaseService.createUser).toHaveBeenCalledWith({
        ...enteredUser,
        password: hashedPassword,
      })
    })

    it('should return correct value', async () => {
      const createdUser: User = {
        _id: new Types.ObjectId(),
        ...enteredUser,
        password: 'hashed_password',
        email: 'email',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userDatabaseService.isUserExistByQuery = jest
        .fn()
        .mockResolvedValue(false)
      userService['hashPassword'] = jest.fn().mockResolvedValue(hashedPassword)
      userDatabaseService.createUser.mockResolvedValue(createdUser)

      await expect(userService.createUser(enteredUser)).resolves.toEqual(
        createdUser,
      )
    })
  })

  describe('getUserByCredentials', () => {
    const mockUser: User = {
      _id: new Types.ObjectId(),
      username: 'username',
      password: 'hashed_password',
      email: 'email',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should throw ValidationError if wrong password provided', async () => {
      const enteredPassword = 'wrongpassword'

      userDatabaseService.findUserByQuery = jest
        .fn()
        .mockResolvedValue(mockUser)
      userService['comparePasswords'] = jest.fn().mockResolvedValue(false)

      await expect(
        userService.getUserByCredentials(mockUser.username, enteredPassword),
      ).rejects.toThrow(ValidationError)
      expect(userDatabaseService.findUserByQuery).toHaveBeenCalledWith({
        username: mockUser.username,
      })
      expect(userService['comparePasswords']).toHaveBeenCalledWith(
        enteredPassword,
        mockUser.password,
      )
    })

    it('should return user if validation is successful', async () => {
      const enteredPassword = 'password'

      userDatabaseService.findUserByQuery = jest
        .fn()
        .mockResolvedValue(mockUser)
      userService['comparePasswords'] = jest.fn().mockResolvedValue(true)
      await userService.getUserByCredentials(mockUser.username, enteredPassword)

      await expect(
        userService.getUserByCredentials(mockUser.username, enteredPassword),
      ).resolves.toEqual(mockUser)
      expect(userDatabaseService.findUserByQuery).toHaveBeenCalledWith({
        username: mockUser.username,
      })
      expect(userService['comparePasswords']).toHaveBeenCalledWith(
        enteredPassword,
        mockUser.password,
      )
    })
  })

  describe('updateUser()', () => {
    const id = new Types.ObjectId()
    const updateParams: UpdateUserDto = {
      password: 'updatedpassword',
    }
    const hashedPassword = 'hashed_password'

    it('should call method with correct arguments', async () => {
      userService['hashPassword'] = jest.fn().mockResolvedValue(hashedPassword)
      await userService.updateUser(id, updateParams)

      expect(userService['hashPassword']).toHaveBeenCalledWith(
        updateParams.password,
      )
      expect(userDatabaseService.updateUser).toHaveBeenCalledWith(id, {
        ...updateParams,
        password: hashedPassword,
      })
    })

    it('should return correct value', async () => {
      const updatedUser: User = {
        _id: new Types.ObjectId(id),
        username: 'username',
        password: hashedPassword,
        email: 'email',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userDatabaseService.updateUser.mockResolvedValue(updatedUser)
      userService['hashPassword'] = jest.fn().mockResolvedValue(hashedPassword)

      await expect(userService.updateUser(id, updateParams)).resolves.toEqual(
        updatedUser,
      )
    })
  })

  describe('deleteUser()', () => {
    it('should call method with correct argument', async () => {
      const id = new Types.ObjectId()

      await userService.deleteUser(id)

      expect(userDatabaseService.deleteUser).toHaveBeenCalledWith(id)
    })
  })
})
