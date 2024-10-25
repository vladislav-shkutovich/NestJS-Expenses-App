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

import { TRANSFERS_ROUTE } from '../common/constants/routing.constants'
import { IdParamDto } from '../common/dto/id-param.dto'
import { CreateTransferDto } from './dto/create-transfer.dto'
import { TransferQueryParamsDto } from './dto/transfer-query-params.dto'
import { UpdateTransferDto } from './dto/update-transfer.dto'
import type { Transfer } from './schemas/transfer.schema'
import { TransferService } from './transfer.service'

@Controller(TRANSFERS_ROUTE)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async createTransfer(
    @Body() createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return await this.transferService.createTransfer(createTransferDto)
  }

  @Get(':id')
  async getTransferById(@Param() params: IdParamDto): Promise<Transfer> {
    return await this.transferService.getTransferById(params.id)
  }

  @Get('/user/:id')
  async getTransfersByUser(
    @Param() params: IdParamDto,
    @Query() query: TransferQueryParamsDto,
  ): Promise<Transfer[]> {
    return await this.transferService.getTransfersByUser(params.id, query)
  }

  @Patch(':id')
  async updateTransfer(
    @Param() params: IdParamDto,
    @Body() updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    return await this.transferService.updateTransfer(
      params.id,
      updateTransferDto,
    )
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTransfer(@Param() params: IdParamDto): Promise<void> {
    return await this.transferService.deleteTransfer(params.id)
  }
}
