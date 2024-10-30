import { Db } from 'mongodb'

import currencies from '../data/currencies.json'

const migration = {
  up: async ({ context }: { context: Db }) => {
    const collection = context.collection('currencies')
    await collection.insertMany(currencies)
  },
  down: async ({ context }: { context: Db }) => {
    const collection = context.collection('currencies')
    await collection.deleteMany({})
  },
}

export default migration
