import { Db } from 'mongodb'

const migration = {
  up: async ({ context }: { context: Db }) => {
    const collection = context.collection('currencies')
    await collection.createIndex({ code: 1 }, { unique: true })
  },
  down: async ({ context }: { context: Db }) => {
    const collection = context.collection('currencies')
    await collection.dropIndex('code_1')
  },
}

export default migration
