import currencies from './data/2025.01.28T10.33.16.currencies-seed-collection-limited-list.data.json' with { type: 'json' }

export async function up({ context }) {
  const collection = context.collection('currencies')
  await collection.insertMany(currencies)
}

export async function down({ context }) {
  const collection = context.collection('currencies')
  const codes = currencies.map((currency) => currency.code)
  await collection.deleteMany({ code: { $in: codes } })
}
