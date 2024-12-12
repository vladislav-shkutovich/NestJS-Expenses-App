const ACCOUNT_INDEX_NAMES = {
  USER_ACCOUNT: 'userId_1_accountType_1',
  USER_CURRENCY: 'userId_1_currencyCode_1',
  USER_ACCOUNT_CURRENCY: 'userId_1_accountType_1_currencyCode_1',
}

export async function up({ context }) {
  const collection = context.collection('accounts')
  await collection.createIndex(
    { userId: 1, accountType: 1 },
    { name: ACCOUNT_INDEX_NAMES.USER_ACCOUNT },
  )
  await collection.createIndex(
    { userId: 1, currencyCode: 1 },
    { name: ACCOUNT_INDEX_NAMES.USER_CURRENCY },
  )
  await collection.createIndex(
    { userId: 1, accountType: 1, currencyCode: 1 },
    { name: ACCOUNT_INDEX_NAMES.USER_ACCOUNT_CURRENCY },
  )
}

export async function down({ context }) {
  const collection = context.collection('accounts')
  await collection.dropIndex(ACCOUNT_INDEX_NAMES.USER_ACCOUNT_CURRENCY)
  await collection.dropIndex(ACCOUNT_INDEX_NAMES.USER_CURRENCY)
  await collection.dropIndex(ACCOUNT_INDEX_NAMES.USER_ACCOUNT)
}
