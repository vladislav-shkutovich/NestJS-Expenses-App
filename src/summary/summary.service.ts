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

  private async createSummary(
    userId: Types.ObjectId,
    date: Date,
  ): Promise<CreateSummaryContent> {
    // * get dateFrom/dateTo fields
    // * get all user accounts
    // * fill accounts map
    // * full currencies map (totals)
    // todo: fill currencies map (convertedTotals)

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
            (sum, [balanceCurrency, balance]) => {
              return (
                sum +
                this.convertAmountByCurrency({
                  amount: balance,
                  baseCurrency: currency,
                  targetCurrency: balanceCurrency,
                  rates: exchangeRates,
                })
              )
            },
            0,
          ),
        }),
        {},
      )

    const accountsMap = accounts.reduce((map, { _id: id, balance }) => {
      return map.set(id, {
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

  // ! convertAmountByCurrency is not implemented yet
  private convertAmountByCurrency({
    amount,
    baseCurrency,
    targetCurrency,
    rates,
  }: {
    amount: number
    baseCurrency: string
    targetCurrency: string
    rates: ExchangeRate[]
  }): number {
    console.log(amount, baseCurrency, targetCurrency, rates)

    return amount * 1
  }
}
