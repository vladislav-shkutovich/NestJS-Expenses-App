export async function up({ context }) {
  const collection = context.collection('currencies')
  await collection.createIndex({ code: 1 }, { unique: true })
}

export async function down({ context }) {
  const collection = context.collection('currencies')
  await collection.dropIndex('code_1')
}
