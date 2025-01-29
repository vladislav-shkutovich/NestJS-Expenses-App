import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { EXCHANGE_RATE_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { ExchangeRateQueryParamsDto } from './dto/exchange-rate-query-params.dto'
import type { CreateExchangeRateContent } from './exchange-rate.types'
import type { ExchangeRate } from './schemas/exchange-rate.schema'

@Injectable()
export class ExchangeRateDatabaseService {
  constructor(
    @InjectModel(EXCHANGE_RATE_MODEL)
    private exchangeRateModel: Model<ExchangeRate>,
  ) {}

  async insertExchangeRates(
    createExchangeRatesContent: CreateExchangeRateContent[],
  ): Promise<void> {
    await this.exchangeRateModel.insertMany(createExchangeRatesContent)
  }

  async getExchangeRates(
    options: ExchangeRateQueryParamsDto,
  ): Promise<ExchangeRate[]> {
    console.error('mock options', options)
    return [] as ExchangeRate[]
  }

  async getLatestValidTo(): Promise<Date> {
    const latestExchangeRate = await this.exchangeRateModel
      .findOne({}, 'validTo')
      .sort({ validTo: -1 })

    if (!latestExchangeRate) {
      throw new NotFoundError(`Latest exchange rate document not found`)
    }

    return latestExchangeRate.validTo
  }
}
