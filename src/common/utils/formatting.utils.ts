export function removeUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}

export function toISODate(date: Date) {
  return date.toISOString().split('T')[0]
}

export function getMonthBoundaries(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  const dateFrom = new Date(year, month, 1, 0, 0, 0, 0)
  const dateTo = new Date(year, month + 1, 0, 23, 59, 59, 999)

  return { dateFrom, dateTo }
}
