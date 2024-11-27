export async function up({ context }) {
  const collection = context.collection('categories')
  await collection.createIndex(
    { archivedAt: 1 },
    { expireAfterSeconds: 604800 },
  )
}

export async function down({ context }) {
  const collection = context.collection('categories')
  await collection.dropIndex('archivedAt_1')
}
