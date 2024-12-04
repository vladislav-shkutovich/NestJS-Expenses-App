export async function up({ context }) {
  const collection = context.collection('operations')
  await collection.createIndex({ userId: 1 })
  await collection.createIndex({ userId: 1, date: -1 })
  await collection.createIndex({ userId: 1, accountType: 1, date: -1 })
  await collection.createIndex({ userId: 1, categoryId: 1, date: -1 })
}

export async function down({ context }) {
  const collection = context.collection('operations')
  await collection.dropIndex('userId_1_categoryId_1_date_-1')
  await collection.dropIndex('userId_1_accountType_1_date_-1')
  await collection.dropIndex('userId_1_date_-1')
  await collection.dropIndex('userId_1')
}
