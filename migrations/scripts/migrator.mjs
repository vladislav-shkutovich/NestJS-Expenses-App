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

const client = new MongoClient(MONGODB_URI)

let exitCode = 0
try {
  await client.connect()
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

  await umzug.runAsCLI()
} catch (err) {
  exitCode = 1
  console.error('Migration failed:', err)
} finally {
  await client.close()
}

process.exit(exitCode)
