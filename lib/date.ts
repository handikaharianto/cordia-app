export const parseDate = (date: string) => {
  const [d, m, y] = date.split("/").map(Number)

  return new Date(y, m - 1, d)
}
