import { Db } from 'mongodb'

import currencies from '../data/20241101102849-currencies-seed-collection.data.json'

module.exports = {
  up: async ({ context }: { context: Db }) => {
    const collection = context.collection('currencies')
    await collection.insertMany(currencies)
  },
  down: async ({ context }: { context: Db }) => {
    const collection = context.collection('currencies')
    const codes = currencies.map((currency) => currency.code)
    await collection.deleteMany({ code: { $in: codes } })
  },
}
