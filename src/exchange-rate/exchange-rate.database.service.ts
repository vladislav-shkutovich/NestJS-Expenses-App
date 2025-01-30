import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { EXCHANGE_RATE_MODEL } from '../common/constants/database.constants'
import { NotFoundError } from '../common/errors/errors'
import { removeUndefined } from '../common/utils/formatting.utils'
import { ExchangeRateQueryParamsDto } from './dto/exchange-rate-query-params.dto'
import type { CreateExchangeRateContent } from './exchange-rate.types'
import type { ExchangeRate } from './schemas/exchange-rate.schema'

@Injectable()
export class ExchangeRateDatabaseService {
  constructor(
    @InjectModel(EXCHANGE_RATE_MODEL)
    private exchangeRateModel: Model<ExchangeRate>,
  ) {}

  async getExchangeRatesOnDate(
    options: ExchangeRateQueryParamsDto,
  ): Promise<ExchangeRate[]> {
    const { date: specifiedDate, ...restOptions } = removeUndefined(options)

    const date = specifiedDate || new Date()

    const query: FilterQuery<ExchangeRate> = {
      ...restOptions,
      validFrom: {
        $lte: date,
      },
      validTo: {
        $gte: date,
      },
    }

    return await this.exchangeRateModel.find(query).lean()
  }

  async insertExchangeRates(
    createExchangeRatesContent: CreateExchangeRateContent[],
  ): Promise<number> {
    const insertedExchangeRates = await this.exchangeRateModel.insertMany(
      createExchangeRatesContent,
    )

    return insertedExchangeRates.length
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
