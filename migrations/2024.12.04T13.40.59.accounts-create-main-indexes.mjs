const ACCOUNT_INDEX_NAMES = {
  USER_CURRENCY: 'userId_1_currencyCode_1',
  USER_CURRENCY_ACCOUNT: 'userId_1_currencyCode_1_accountType_1',
}

export async function up({ context }) {
  const collection = context.collection('accounts')
  await collection.createIndex(
    { userId: 1, currencyCode: 1 },
    { name: ACCOUNT_INDEX_NAMES.USER_CURRENCY },
  )
  await collection.createIndex(
    { userId: 1, currencyCode: 1, accountType: 1 },
    { name: ACCOUNT_INDEX_NAMES.USER_CURRENCY_ACCOUNT },
  )
}

export async function down({ context }) {
  const collection = context.collection('accounts')
  await collection.dropIndex(ACCOUNT_INDEX_NAMES.USER_CURRENCY_ACCOUNT)
  await collection.dropIndex(ACCOUNT_INDEX_NAMES.USER_CURRENCY)
}
