import fs from 'node:fs/promises'
import path from 'node:path'

const createMigrationTemplate = async (name: string) => {
  try {
    const migrationsDir = path.join(__dirname, '../versioned')
    await fs.mkdir(migrationsDir, { recursive: true })

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14)
    const fileName = `${timestamp}-${name}.ts`
    const filePath = path.join(migrationsDir, fileName)
    const fileContent = `
    import { Db } from 'mongodb'

    const migration = {
      up: async ({ context }: { context: Db }) => {
        // Implement migration up
      },
      down: async ({ context }: { context: Db }) => {
        // Implement migration down
      },
    }

    export default migration
  `

    await fs.writeFile(filePath, fileContent)

    console.log(`Created migration ${fileName}`)
    process.exit(0)
  } catch (error) {
    console.error('Error creating migration:', error)
    process.exit(1)
  }
}

const [name] = process.argv.slice(2)

if (!name) {
  console.error('Please provide a file name for the migration')
  process.exit(1)
}

createMigrationTemplate(name)
