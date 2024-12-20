const TRANSFER_INDEX_NAMES = {
  USER_DATE: 'userId_1_date_1',
  USER_FROM_CURRENCYCODE_DATE: 'userId_1_from.currencyCode_1_date_1',
  USER_TO_CURRENCYCODE_DATE: 'userId_1_to.currencyCode_1_date_1',
  USER_FROM_ACCOUNTID_DATE: 'userId_1_from.accountId_1_date_1',
  USER_TO_ACCOUNTID_DATE: 'userId_1_to.accountId_1_date_1',
}

export async function up({ context }) {
  const collection = context.collection('transfers')
  await collection.createIndex(
    { userId: 1, date: 1 },
    { name: TRANSFER_INDEX_NAMES.USER_DATE },
  )
  await collection.createIndex(
    { userId: 1, 'from.currencyCode': 1, date: 1 },
    { name: TRANSFER_INDEX_NAMES.USER_FROM_CURRENCYCODE_DATE },
  )
  await collection.createIndex(
    { userId: 1, 'to.currencyCode': 1, date: 1 },
    { name: TRANSFER_INDEX_NAMES.USER_TO_CURRENCYCODE_DATE },
  )
  await collection.createIndex(
    { userId: 1, 'from.accountId': 1, date: 1 },
    { name: TRANSFER_INDEX_NAMES.USER_FROM_ACCOUNTID_DATE },
  )
  await collection.createIndex(
    { userId: 1, 'to.accountId': 1, date: 1 },
    { name: TRANSFER_INDEX_NAMES.USER_TO_ACCOUNTID_DATE },
  )
}

export async function down({ context }) {
  const collection = context.collection('transfers')
  await collection.dropIndex(TRANSFER_INDEX_NAMES.USER_TO_ACCOUNTID_DATE)
  await collection.dropIndex(TRANSFER_INDEX_NAMES.USER_FROM_ACCOUNTID_DATE)
  await collection.dropIndex(TRANSFER_INDEX_NAMES.USER_TO_CURRENCYCODE_DATE)
  await collection.dropIndex(TRANSFER_INDEX_NAMES.USER_FROM_CURRENCYCODE_DATE)
  await collection.dropIndex(TRANSFER_INDEX_NAMES.USER_DATE)
}
