export async function up({ context }) {
  const collection = context.collection('accounts')
  await collection.createIndex({ userId: 1 })
  await collection.createIndex({ userId: 1, currencyCode: 1 })
  await collection.createIndex({ userId: 1, accountType: 1 })
  await collection.createIndex({ userId: 1, currencyCode: 1, accountType: 1 })
}

export async function down({ context }) {
  const collection = context.collection('accounts')
  await collection.dropIndex('userId_1_currencyCode_1_accountType_1')
  await collection.dropIndex('userId_1_accountType_1')
  await collection.dropIndex('userId_1_currencyCode_1')
  await collection.dropIndex('userId_1')
}
