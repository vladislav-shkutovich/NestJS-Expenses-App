const EXCHANGE_RATES_INDEX_NAMES = {
  VALIDTO: 'validTo_1',
  VALIDFROM_VALIDTO: 'validFrom_1_validTo_1',
  BASECURRENCY_TARGETCURRENCY_VALIDFROM_VALIDTO:
    'baseCurrency_1_targetCurrency_1_validFrom_1_validTo_1',
}

export async function up({ context }) {
  const collection = context.collection('exchangerates')
  await collection.createIndex(
    { validTo: 1 },
    { name: EXCHANGE_RATES_INDEX_NAMES.VALIDTO },
  )
  await collection.createIndex(
    { validFrom: 1, validTo: 1 },
    { name: EXCHANGE_RATES_INDEX_NAMES.VALIDFROM_VALIDTO },
  )
  await collection.createIndex(
    { baseCurrency: 1, targetCurrency: 1, validFrom: 1, validTo: 1 },
    {
      name: EXCHANGE_RATES_INDEX_NAMES.BASECURRENCY_TARGETCURRENCY_VALIDFROM_VALIDTO,
    },
  )
}

export async function down({ context }) {
  const collection = context.collection('exchangerates')
  await collection.dropIndex(
    EXCHANGE_RATES_INDEX_NAMES.BASECURRENCY_TARGETCURRENCY_VALIDFROM_VALIDTO,
  )
  await collection.dropIndex(EXCHANGE_RATES_INDEX_NAMES.VALIDFROM_VALIDTO)
  await collection.dropIndex(EXCHANGE_RATES_INDEX_NAMES.VALIDTO)
}
