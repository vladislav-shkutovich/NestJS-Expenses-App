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
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
  ): Promise<Transfer> {
    return await this.transferService.getTransfer(params.id, req.user._id)
  }

  @Get()
  async getTransfers(
    @Query() query: TransferQueryParamsDto,
  ): Promise<Transfer[]> {
    return await this.transferService.getTransfers(query)
  }

  @Patch(':id')
  async updateTransfer(
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
    @Body() updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    return await this.transferService.updateTransfer(
      params.id,
      req.user._id,
      updateTransferDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTransfer(
    @Param() params: IdParamDto,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    return await this.transferService.deleteTransfer(params.id, req.user._id)
  }
}
