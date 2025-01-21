import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import type { Request as ExpressRequest } from 'express'

import { ACCOUNTS_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { UserIdOwnershipGuard } from '../common/guards/user-id-ownership.guard'
import { AccountService } from './account.service'
import { AccountQueryParamsDto } from './dto/account-query-params.dto'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import type { Account } from './schemas/account.schema'

@Controller(ACCOUNTS_ROUTE)
@UseGuards(UserIdOwnershipGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return await this.accountService.createAccount(createAccountDto)
  }

  @Get(':id')
  async getAccount(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
  ): Promise<Account> {
    return await this.accountService.getAccount(id, userId)
  }

  @Get()
  async getAccounts(@Query() query: AccountQueryParamsDto): Promise<Account[]> {
    return await this.accountService.getAccounts(query)
  }

  @Patch(':id')
  async updateAccount(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return await this.accountService.updateAccount(id, userId, updateAccountDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAccount(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
  ): Promise<void> {
    return await this.accountService.deleteAccount(id, userId)
  }
}
