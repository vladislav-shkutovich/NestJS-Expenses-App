import 'dotenv/config'
import { MongoDBStorage, Umzug } from 'umzug'
import { MongoClient } from 'mongodb'

const databaseUrl = process.env.MONGODB_URI

if (!databaseUrl) {
  console.error('Failed to get MONGODB_URI env variable')
  process.exit(1)
}

const client = new MongoClient(databaseUrl)

const runMigrations = async (action: 'up' | 'down') => {
  try {
    await client.connect()
    const db = client.db()

    const umzug = new Umzug({
      context: db,
      migrations: {
        glob: 'migrations/versioned/*.ts',
        resolve: ({ name, path, context }) => {
          if (!path) {
            console.error(`Failed to get ${name} file by path`)
            process.exit(1)
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
        collection: db.collection('migrations'),
      }),
      logger: console,
    })

    if (action === 'up') {
      const migrations = await umzug.up()
      console.log(
        'Migrations up:',
        migrations.map((migration) => migration.name),
      )
      process.exit(0)
    }

    if (action === 'down') {
      const migrations = await umzug.down()
      console.log(
        'Migrations down:',
        migrations.map((migration) => migration.name),
      )
      process.exit(0)
    }
  } catch (error) {
    console.error('Migration failed', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

const [action] = process.argv.slice(2)

if (!(action === 'up' || action === 'down')) {
  console.error('Please specify "up" or "down" as arguments')
  process.exit(1)
}

runMigrations(action)
