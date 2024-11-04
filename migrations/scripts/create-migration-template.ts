import fs from 'node:fs/promises'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(__dirname, '..')

const getTimestamp = (): string => {
  return new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14)
}

const getMigrationTemplate = (): string => {
  return `import { Db } from 'mongodb'

module.exports = {
  up: async ({ context }: { context: Db }) => {
    // Implement migration up
  },
  down: async ({ context }: { context: Db }) => {
    // Implement migration down
  },
}
`
}

const createMigrationFile = async (
  fileName: string,
  content: string,
): Promise<void> => {
  const filePath = path.join(MIGRATIONS_DIR, fileName)
  await fs.writeFile(filePath, content)
}

const createMigrationTemplate = async (name: string): Promise<void> => {
  await fs.mkdir(MIGRATIONS_DIR, { recursive: true })

  const timestamp = getTimestamp()
  const fileName = `${timestamp}-${name}.ts`
  const fileContent = getMigrationTemplate()

  await createMigrationFile(fileName, fileContent)

  console.log(`Created migration ${fileName}`)
}

const main = async () => {
  const [name] = process.argv.slice(2)

  if (!name) {
    console.error('Please provide a file name for the migration')
    process.exit(1)
  }

  try {
    await createMigrationTemplate(name)
    process.exit(0)
  } catch (error) {
    console.error('Error creating migration:', error)
    process.exit(1)
  }
}

main()
