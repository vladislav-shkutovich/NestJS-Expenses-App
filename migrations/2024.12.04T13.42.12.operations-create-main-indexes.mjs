const OPERATION_INDEX_NAMES = {
  USER_DATE: 'userId_1_date_1',
  USER_ACCOUNT_DATE: 'userId_1_accountType_1_date_1',
  USER_CATEGORY_DATE: 'userId_1_categoryId_1_date_1',
}

export async function up({ context }) {
  const collection = context.collection('operations')
  await collection.createIndex(
    { userId: 1, date: 1 },
    { name: OPERATION_INDEX_NAMES.USER_DATE },
  )
  await collection.createIndex(
    { userId: 1, accountType: 1, date: 1 },
    { name: OPERATION_INDEX_NAMES.USER_ACCOUNT_DATE },
  )
  await collection.createIndex(
    { userId: 1, categoryId: 1, date: 1 },
    { name: OPERATION_INDEX_NAMES.USER_CATEGORY_DATE },
  )
}

export async function down({ context }) {
  const collection = context.collection('operations')
  await collection.dropIndex(OPERATION_INDEX_NAMES.USER_CATEGORY_DATE)
  await collection.dropIndex(OPERATION_INDEX_NAMES.USER_ACCOUNT_DATE)
  await collection.dropIndex(OPERATION_INDEX_NAMES.USER_DATE)
}
