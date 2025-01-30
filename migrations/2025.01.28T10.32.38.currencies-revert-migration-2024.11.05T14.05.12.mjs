import currencies from './data/2024.11.05T14.05.12.currencies-seed-collection.data.json' with { type: 'json' }

export async function up({ context }) {
  const collection = context.collection('currencies')
  const codes = currencies.map((currency) => currency.code)
  await collection.deleteMany({ code: { $in: codes } })
}

export async function down({ context }) {
  const collection = context.collection('currencies')
  await collection.insertMany(currencies)
}
