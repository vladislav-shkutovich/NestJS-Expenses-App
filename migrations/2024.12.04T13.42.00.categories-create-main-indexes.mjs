const CATEGORY_INDEX_NAMES = {
  USER_TYPE_ISARCHIVED: 'userId_1_type_1_isArchived_1',
}

export async function up({ context }) {
  const collection = context.collection('categories')
  await collection.createIndex(
    { userId: 1, type: 1, isArchived: 1 },
    { name: CATEGORY_INDEX_NAMES.USER_TYPE_ISARCHIVED },
  )
}

export async function down({ context }) {
  const collection = context.collection('categories')
  await collection.dropIndex(CATEGORY_INDEX_NAMES.USER_TYPE_ISARCHIVED)
}
