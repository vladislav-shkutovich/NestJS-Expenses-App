import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import { AccountService } from '../account/account.service'
import { BASE_CURRENCY } from '../common/constants/currency.constants'
import { getMonthBoundaries } from '../common/utils/formatting.utils'
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service'
import { ExchangeRate } from '../exchange-rate/schemas/exchange-rate.schema'
import type { SummaryQueryParamsDto } from './dto/summary-query-params.dto'
import type {
  AccountEntry,
  CurrencyEntry,
  Summary,
} from './schemas/summary.schema'
import { SummaryDatabaseService } from './summary.database.service'
import type {
  CreateSummaryContent,
  SummaryOnAccountCreateParams,
  SummaryOnTransactionCreateDeleteParams,
  SummaryOnTransactionUpdateParams,
} from './summary.types'
import { NotFoundError } from '../common/errors/errors'

// TODO: - Add a better typing for current summaries methods;

@Injectable()
export class SummaryService {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly summaryDatabaseService: SummaryDatabaseService,
  ) {}

  async getSummaries(options: SummaryQueryParamsDto): Promise<Summary[]> {
    return await this.summaryDatabaseService.getSummaries(options)
  }

  // TODO: - Refactor `createSummary` method to reduce calculations;
  private async createSummary(
    userId: Types.ObjectId,
    date: Date,
  ): Promise<CreateSummaryContent> {
    const accounts = await this.accountService.getAccounts({ userId })
    const currencies = [
      ...new Set(accounts.map(({ currencyCode }) => currencyCode)),
    ]
    const fullExchangeRates =
      await this.exchangeRateService.getExchangeRatesOnDate({
        baseCurrency: BASE_CURRENCY,
        date,
      })
    const exchangeRates = fullExchangeRates.filter((rate) =>
      currencies.includes(rate.targetCurrency),
    )

    const balancesPerCurrency: { [currency: string]: number } =
      currencies.reduce(
        (balances, currency) => ({
          ...balances,
          [currency]: accounts
            .filter(({ currencyCode }) => currencyCode === currency)
            .reduce((sum, { balance }) => sum + balance, 0),
        }),
        {},
      )

    const convertedBalancesPerCurrency: { [currency: string]: number } =
      currencies.reduce(
        (convertedBalances, currency) => ({
          ...convertedBalances,
          [currency]: Object.entries(balancesPerCurrency).reduce(
            (sum, [balanceCurrency, balanceValue]) => {
              return (
                sum +
                this.convertAmountIntoCurrency({
                  amount: balanceValue,
                  fromCurrency: balanceCurrency,
                  intoCurrency: currency,
                  exchangeRates,
                })
              )
            },
            0,
          ),
        }),
        {},
      )

    const accountsMap = accounts.reduce((map, { _id, balance }) => {
      return map.set(_id, {
        totals: {
          startingBalance: balance,
          endingBalance: balance,
          totalIncome: 0,
          totalExpense: 0,
        },
      })
    }, new Map<Types.ObjectId, AccountEntry>())

    const currenciesMap = currencies.reduce((map, currency) => {
      return map.set(currency, {
        totals: {
          startingBalance: balancesPerCurrency[currency],
          endingBalance: balancesPerCurrency[currency],
          totalIncome: 0,
          totalExpense: 0,
        },
        convertedTotals: {
          startingBalance: convertedBalancesPerCurrency[currency],
          endingBalance: convertedBalancesPerCurrency[currency],
          totalIncome: 0,
          totalExpense: 0,
        },
      })
    }, new Map<string, CurrencyEntry>())

    const { dateFrom, dateTo } = getMonthBoundaries(date)

    return {
      userId,
      dateFrom,
      dateTo,
      accounts: accountsMap,
      currencies: currenciesMap,
    }
  }

  async processSummariesOnAccountCreate(
    params: SummaryOnAccountCreateParams,
  ): Promise<void> {
    // TODO: - Provide conditions to create or/and process summaries;
    const summary = await this.createSummary(params.userId, new Date())
    console.log('summary:', summary)
    console.log(params)
    throw new Error('processSummariesOnAccountCreate in not implemented')
  }

  async processSummariesOnOperationCreateDelete(
    params: SummaryOnTransactionCreateDeleteParams,
  ) {
    console.log(params)
    throw new Error(
      'processSummariesOnOperationCreateDelete in not implemented',
    )
  }

  async processSummariesOnOperationUpdate(
    params: SummaryOnTransactionUpdateParams,
  ) {
    console.log(params)
    throw new Error('processSummariesOnOperationUpdate in not implemented')
  }

  // TODO: - Check if it possible to unite process summary methods for operations and transfers;
  async processSummariesOnTransferCreateDelete(
    params: SummaryOnTransactionCreateDeleteParams,
  ) {
    console.log(params)
    throw new Error('processSummariesOnTransferCreateDelete in not implemented')
  }

  async processSummariesOnTransferUpdate(
    params: SummaryOnTransactionUpdateParams,
  ) {
    console.log(params)
    throw new Error('processSummariesOnTransferUpdate in not implemented')
  }

  // TODO: - Refactor `convertAmountIntoCurrency` helper to reduce calculations;
  private convertAmountIntoCurrency({
    amount,
    fromCurrency,
    intoCurrency,
    exchangeRates,
  }: {
    amount: number
    fromCurrency: string
    intoCurrency: string
    exchangeRates: ExchangeRate[]
  }): number {
    if (fromCurrency === intoCurrency) return amount

    const baseExchangeRate = {
      rate: 1,
      scale: 1,
    }

    const getRateByCurrency = (currency: string) => {
      const exchangeRate = exchangeRates.find(
        ({ targetCurrency }) => targetCurrency === currency,
      )

      if (!exchangeRate)
        throw new NotFoundError(
          `Exchange rate for ${currency} not found. Failed to process summary.`,
        )

      return {
        rate: exchangeRate.rate,
        scale: exchangeRate.scale,
      }
    }

    const fromExchangeRate =
      fromCurrency === BASE_CURRENCY
        ? baseExchangeRate
        : getRateByCurrency(fromCurrency)

    const intoExchangeRate =
      intoCurrency === BASE_CURRENCY
        ? baseExchangeRate
        : getRateByCurrency(intoCurrency)

    const convertedAmount =
      (amount * fromExchangeRate.rate * intoExchangeRate.scale) /
      (fromExchangeRate.scale * intoExchangeRate.rate)

    return Math.round(convertedAmount)
  }
}
