export async function up({ context }) {
  const collection = context.collection('categories')
  await collection.createIndex({ userId: 1, name: 1 }, { unique: true })
}

export async function down({ context }) {
  const collection = context.collection('categories')
  await collection.dropIndex('userId_1_name_1')
}
