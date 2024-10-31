import 'dotenv/config'
import { Db, MongoClient } from 'mongodb'
import { MongoDBStorage, Umzug } from 'umzug'

type Action = 'up' | 'down'

const MONGODB_URI = process.env.MONGODB_URI
const MIGRATIONS_COLLECTION = 'migrations'

if (!MONGODB_URI) {
  console.error('Failed to get MONGODB_URI env variable')
  process.exit(1)
}

const getDatabaseClient = async (uri: string): Promise<MongoClient> => {
  const client = new MongoClient(uri)
  await client.connect()
  return client
}

const setupUmzug = (db: Db): Umzug<Db> => {
  return new Umzug({
    context: db,
    migrations: {
      glob: 'migrations/versioned/*.ts',
      resolve: ({ name, path, context }) => {
        if (!path) {
          throw new Error(`Failed to get path for migration ${name}`)
        }

        const migration = require(path).default

        return {
          name,
          up: () => migration.up({ context }),
          down: () => migration.down({ context }),
        }
      },
    },
    storage: new MongoDBStorage({
      collection: db.collection(MIGRATIONS_COLLECTION),
    }),
    logger: console,
  })
}

const executeMigrations = async (umzug: Umzug, action: Action) => {
  if (action === 'up') {
    const migrations = await umzug.up()
    console.log(
      'Migrations up:',
      migrations.map((migration) => migration.name),
    )
  }
  if (action === 'down') {
    const migrations = await umzug.down()
    console.log(
      'Migrations down:',
      migrations.map((migration) => migration.name),
    )
  }
}

const runMigrations = async (action: Action) => {
  const client = await getDatabaseClient(MONGODB_URI)
  try {
    const db = client.db()
    const umzug = setupUmzug(db)
    await executeMigrations(umzug, action)
  } catch (error) {
    console.error('Migration failed', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

const main = async () => {
  const [action] = process.argv.slice(2) as [Action]

  if (!['up', 'down'].includes(action)) {
    console.error('Please specify "up" or "down" as arguments')
    process.exit(1)
  }

  try {
    await runMigrations(action)
    process.exit(0)
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

main()
