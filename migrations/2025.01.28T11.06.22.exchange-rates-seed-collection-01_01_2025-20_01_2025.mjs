const baseCurrency = 'BYN'
const source =
  'NBRB API: Migration 2025.01.28T11.06.22.exchange-rates-seed-collection-01_01_2025-20_01_2025'

function getDateRange(dateFrom, dateTo) {
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
  // Check docs at https://www.nbrb.by/apihelp/exrates for periodicity
  const dayPeriodicity = 0
  const monthPeriodicity = 1

  const [dayPeriodicityRatesResponse, monthPeriodicityRatesResponse] =
    await Promise.all([
      fetch(
        `https://api.nbrb.by/exrates/rates?periodicity=${dayPeriodicity}&ondate=${date}`,
      ),
      fetch(
        `https://api.nbrb.by/exrates/rates?periodicity=${monthPeriodicity}&ondate=${date}`,
      ),
    ])

  if (!dayPeriodicityRatesResponse.ok || !monthPeriodicityRatesResponse.ok) {
    throw new Error(`Failed to fetch rates for date: ${date} from api.nbrb.by`)
  }

  const [dayPeriodicityRates, monthPeriodicityRates] = await Promise.all([
    dayPeriodicityRatesResponse.json(),
    monthPeriodicityRatesResponse.json(),
  ])

  return [...dayPeriodicityRates, ...monthPeriodicityRates]
}

export async function up({ context }) {
  const currenciesCollection = context.collection('currencies')
  const exchangeRatesCollection = context.collection('exchangerates')

  const currencies = await currenciesCollection.find().toArray()

  const ratesOnDateRange = []
  const dateRange = getDateRange('2025-01-01', '2025-01-20')

  await Promise.all(
    dateRange.map(async (date) => {
      try {
        console.debug(`Processing date: ${date}`)
        const ratesOnDate = await fetchRatesOnDate(date)
        const ratesOnDateByCurrencies = ratesOnDate.filter((rate) =>
          currencies.some(
            (currency) => currency.code === rate.Cur_Abbreviation,
          ),
        )

        const validFrom = new Date(`${date}T14:00:00`)
        const validTo = new Date(`${date}T13:59:59.999`)
        validTo.setDate(validTo.getDate() + 1)

        const formattedRatesOnDate = ratesOnDateByCurrencies.map((rate) => ({
          baseCurrency,
          targetCurrency: rate.Cur_Abbreviation,
          validFrom,
          validTo,
          rate: rate.Cur_OfficialRate,
          source,
          scale: rate.Cur_Scale,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))

        ratesOnDateRange.push(...formattedRatesOnDate)
      } catch (error) {
        console.error(`Error processing date ${date}:`, error)
      }
    }),
  )

  await exchangeRatesCollection.insertMany(
    ratesOnDateRange.sort((a, b) => a.validFrom - b.validFrom),
  )
  console.debug(`Inserted ${ratesOnDateRange.length} records.`)
}

export async function down({ context }) {
  const exchangeRatesCollection = context.collection('exchangerates')
  const { deletedCount } = await exchangeRatesCollection.deleteMany({
    source,
  })
  console.debug(`Deleted ${deletedCount} records with source: ${source}`)
}
