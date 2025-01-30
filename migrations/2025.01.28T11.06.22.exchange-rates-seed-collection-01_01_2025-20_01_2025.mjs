const BASE_CURRENCY = 'BYN'
const VALIDITY_START_TIME = 'T11:00:00'
const VALIDITY_END_TIME = 'T10:59:59.999'
const SOURCE_ON_MIGRATION =
  'Initial exchange rates from the NBRB API using migration 2025.01.28T11.06.22.exchange-rates-seed-collection-01_01_2025-20_01_2025'
const NBRB_API_URL = 'https://api.nbrb.by/exrates/rates'
// For periodicity params check docs at https://www.nbrb.by/apihelp/exrates
const PERIODICITY_DAY = 0
const PERIODICITY_MONTH = 1

function getISODateRange(dateFrom, dateTo) {
  const dateArray = []
  const endDate = new Date(dateTo)
  const currentDate = new Date(dateFrom)

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate).toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateArray
}

async function fetchRatesOnDate(date) {
  try {
    const [dayRatesResponse, monthRatesResponse] = await Promise.all([
      fetch(`${NBRB_API_URL}?periodicity=${PERIODICITY_DAY}&ondate=${date}`),
      fetch(`${NBRB_API_URL}?periodicity=${PERIODICITY_MONTH}&ondate=${date}`),
    ])

    if (!dayRatesResponse.ok || !monthRatesResponse.ok) {
      throw new Error(
        `Failed to fetch exchange rates for date ${date} from NBRB API`,
      )
    }

    const [dayRates, monthRates] = await Promise.all([
      dayRatesResponse.json(),
      monthRatesResponse.json(),
    ])

    return [...dayRates, ...monthRates]
  } catch (error) {
    throw new Error(
      `Something went wrong while getting exchange rates for date ${date} from NBRB API`,
    )
  }
}

export async function up({ context }) {
  const currenciesCollection = context.collection('currencies')
  const exchangeRatesCollection = context.collection('exchangerates')

  const currencies = await currenciesCollection.find().toArray()

  const ratesOnDateRange = []
  const dateRange = getISODateRange('2025-01-01', '2025-01-20')

  await Promise.all(
    dateRange.map(async (date) => {
      try {
        console.debug(`Processing date: ${date}...`)

        const ratesOnDate = await fetchRatesOnDate(date)

        const ratesOnDateByCurrencies = ratesOnDate.filter((rate) =>
          currencies.some(
            (currency) => currency.code === rate.Cur_Abbreviation,
          ),
        )

        const validFrom = new Date(`${date}${VALIDITY_START_TIME}`)
        const validTo = new Date(`${date}${VALIDITY_END_TIME}`)

        validTo.setDate(validTo.getDate() + 1)

        const formattedRatesOnDate = ratesOnDateByCurrencies.map((rate) => ({
          BASE_CURRENCY,
          targetCurrency: rate.Cur_Abbreviation,
          validFrom,
          validTo,
          rate: rate.Cur_OfficialRate,
          source: SOURCE_ON_MIGRATION,
          scale: rate.Cur_Scale,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))

        ratesOnDateRange.push(...formattedRatesOnDate)
      } catch (error) {
        throw new Error(`Error processing exchange rates on date ${date}`)
      }
    }),
  )

  await exchangeRatesCollection.insertMany(ratesOnDateRange)
  console.debug(`Inserted ${ratesOnDateRange.length} exchange rate records.`)
}

export async function down({ context }) {
  const exchangeRatesCollection = context.collection('exchangerates')
  const { deletedCount } = await exchangeRatesCollection.deleteMany({
    source: SOURCE_ON_MIGRATION,
  })
  console.debug(
    `Deleted ${deletedCount} records with source: ${SOURCE_ON_MIGRATION}`,
  )
}
