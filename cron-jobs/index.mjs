import 'dotenv/config'
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

const BASE_CURRENCY = 'BYN'
const VALIDITY_START_TIME = 'T11:00:00'
const VALIDITY_END_TIME = 'T10:59:59.999'
const SOURCE_ON_CRON = 'Daily exchange rates at UTC 11:00:00'
const NBRB_API_URL = 'https://api.nbrb.by/exrates/rates'
const PERIODICITY_DAY = 0
const PERIODICITY_MONTH = 1

async function fetchRatesOnDate(date) {
  try {
    const [dayRatesResponse, monthRatesResponse] = await Promise.all([
      fetch(`${NBRB_API_URL}?periodicity=${PERIODICITY_DAY}&ondate=${date}`),
      fetch(`${NBRB_API_URL}?periodicity=${PERIODICITY_MONTH}&ondate=${date}`),
    ])

    const errors = []
    if (!dayRatesResponse.ok) {
      errors.push(
        `Day rates: ${dayRatesResponse.status} ${dayRatesResponse.statusText}`,
      )
    }
    if (!monthRatesResponse.ok) {
      errors.push(
        `Month rates: ${monthRatesResponse.status} ${monthRatesResponse.statusText}`,
      )
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }

    const [dayRates, monthRates] = await Promise.all([
      dayRatesResponse.json(),
      monthRatesResponse.json(),
    ])

    const validFrom = new Date(`${date}${VALIDITY_START_TIME}`)
    const validTo = new Date(`${date}${VALIDITY_END_TIME}`)

    validTo.setDate(validTo.getDate() + 1)

    return [...dayRates, ...monthRates].map((rate) => ({
      baseCurrency: BASE_CURRENCY,
      targetCurrency: rate.Cur_Abbreviation,
      validFrom,
      validTo,
      rate: rate.Cur_OfficialRate,
      source: SOURCE_ON_CRON,
      scale: rate.Cur_Scale,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  } catch (error) {
    throw new Error(
      `Failed to fetch exchange rates for date ${date} from NBRB API.`,
      { cause: error },
    )
  }
}

function getISODateRange(dateFrom, dateTo) {
  const nextDate = new Date(dateFrom)
  const dateArray = []

  while (nextDate <= dateTo) {
    dateArray.push(nextDate.toISOString().split('T')[0])
    nextDate.setDate(nextDate.getDate() + 1)
  }

  return dateArray
}

async function main() {
  console.debug(`Checking for: ${SOURCE_ON_CRON}...`)

  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()
    const currenciesCollection = db.collection('currencies')
    const exchangeRatesCollection = db.collection('exchangerates')

    const currentDate = new Date()
    const latestRecord = await exchangeRatesCollection
      .find()
      .sort({ validTo: -1 })
      .limit(1)
      .toArray()

    if (latestRecord.length === 0) {
      throw new Error(
        'No exchange rates found in database. Run migrations first!',
      )
    }

    const latestDate = latestRecord[0].validTo

    if (latestDate > currentDate) {
      console.debug('Exchange rates are up to date.')
      process.exit(0)
    }

    const currencies = await currenciesCollection.find().toArray()

    const dateRange = getISODateRange(latestDate, currentDate)

    const ratesOnDateRange = []
    await Promise.all(
      dateRange.map(async (date) => {
        try {
          console.debug(`Processing date: ${date}...`)
          const ratesOnDate = await fetchRatesOnDate(date)

          const ratesOnDateByCurrencies = ratesOnDate.filter((rate) =>
            currencies.some(
              (currency) => currency.code === rate.targetCurrency,
            ),
          )

          ratesOnDateRange.push(...ratesOnDateByCurrencies)
        } catch (error) {
          console.error(`Error processing date ${date}:`, error)
        }
      }),
    )

    if (ratesOnDateRange.length > 0) {
      await exchangeRatesCollection.insertMany(ratesOnDateRange)
      console.debug(
        `Inserted ${ratesOnDateRange.length} exchange rate records.`,
      )
    } else {
      console.debug('No new exchange rates to insert.')
    }
  } catch (error) {
    console.error('Error in main function:', error)
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
