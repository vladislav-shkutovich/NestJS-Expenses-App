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

import { TRANSFERS_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { UserIdOwnershipGuard } from '../common/guards/user-id-ownership.guard'
import { CreateTransferDto } from './dto/create-transfer.dto'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'
import { TransferService } from './transfer.service'

@Controller(TRANSFERS_ROUTE)
@UseGuards(UserIdOwnershipGuard)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async createTransfer(
    @Body() createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return await this.transferService.createTransfer(createTransferDto)
  }

  @Get(':id')
  async getTransfer(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
  ): Promise<Transfer> {
    return await this.transferService.getTransfer(id, userId)
  }

  @Get()
  async getTransfers(
    @Query() query: TransferQueryParamsDto,
  ): Promise<Transfer[]> {
    return await this.transferService.getTransfers(query)
  }

  @Patch(':id')
  async updateTransfer(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
    @Body() updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    return await this.transferService.updateTransfer(
      id,
      userId,
      updateTransferDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTransfer(
    @Param() { id }: IdParamDto,
    @Request() { user: { _id: userId } }: ExpressRequest,
  ): Promise<void> {
    return await this.transferService.deleteTransfer(id, userId)
  }
}
