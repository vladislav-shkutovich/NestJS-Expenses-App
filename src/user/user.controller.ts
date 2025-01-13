import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { USERS_ROUTE } from '../common/constants/routing.constants'
import { Public } from '../common/decorators/public.decorator'
import { IdParamDto } from '../common/dto/id-param.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserOwnershipGuard } from './guards/user-ownership.guard'
import { UserService } from './user.service'
import type { UserWithoutPassword } from './user.types'

@Controller(USERS_ROUTE)
@UseGuards(UserOwnershipGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    return await this.userService.createUser(createUserDto)
  }

  @Get(':id')
  async getUserById(@Param() params: IdParamDto): Promise<UserWithoutPassword> {
    return await this.userService.getUserById(params.id)
  }

  @Patch(':id')
  async updateUser(
    @Param() params: IdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    return await this.userService.updateUser(params.id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param() params: IdParamDto): Promise<void> {
    return await this.userService.deleteUser(params.id)
  }
}
