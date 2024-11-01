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
} from '@nestjs/common'

import { ACCOUNTS_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { AccountService } from './account.service'
import { AccountQueryParamsDto } from './dto/account-query-params.dto'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import type { Account } from './schemas/account.schema'

@Controller(ACCOUNTS_ROUTE)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return await this.accountService.createAccount(createAccountDto)
  }

  @Get(':id')
  async getAccountById(@Param() params: IdParamDto): Promise<Account> {
    return await this.accountService.getAccountById(params.id)
  }

  @Get()
  async getAccountsByUser(
    @Query() query: AccountQueryParamsDto,
  ): Promise<Account[]> {
    return await this.accountService.getAccountsByUser(query)
  }

  @Patch(':id')
  async updateAccount(
    @Param() params: IdParamDto,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return await this.accountService.updateAccount(params.id, updateAccountDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAccount(@Param() params: IdParamDto): Promise<void> {
    return await this.accountService.deleteAccount(params.id)
  }
}
