export async function up({ context }) {
  const collection = context.collection('categories')
  await collection.createIndex({ userId: 1 })
  await collection.createIndex({ userId: 1, type: 1 })
  await collection.createIndex({ userId: 1, type: 1, isArchived: -1 })
}

export async function down({ context }) {
  const collection = context.collection('categories')
  await collection.dropIndex('userId_1_type_1_isArchived_-1')
  await collection.dropIndex('userId_1_type_1')
  await collection.dropIndex('userId_1')
}
