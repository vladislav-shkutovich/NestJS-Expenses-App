import { MongoClient } from 'mongodb'
import { MongoDBStorage, Umzug } from 'umzug'
import { readFileSync } from 'node:fs'

const MONGODB_URI = process.env.MONGODB_URI
const MIGRATIONS_COLLECTION = 'migrations'

if (!MONGODB_URI) {
  console.error(
    'MONGODB_URI was not provided by the CLI params. Please make sure you provide this variable (example: MONGODB_URI="your_uri" yarn <migration-command>)',
  )
  process.exit(1)
}

const getDatabaseClient = async (uri) => {
  const client = new MongoClient(uri)
  await client.connect()
  return client
}

const setupUmzug = async () => {
  const client = await getDatabaseClient(MONGODB_URI)
  const db = client.db()

  const umzug = new Umzug({
    context: db,
    migrations: {
      glob: 'migrations/*.mjs',
    },
    create: {
      template: (filepath) => [
        [
          filepath,
          readFileSync(
            'migrations/templates/migration.template.mjs',
          ).toString(),
        ],
      ],
    },
    storage: new MongoDBStorage({
      collection: db.collection(MIGRATIONS_COLLECTION),
    }),
    logger: console,
  })

  return { umzug, client }
}

const { umzug, client } = await setupUmzug()

umzug
  .runAsCLI()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(() => client.close())
