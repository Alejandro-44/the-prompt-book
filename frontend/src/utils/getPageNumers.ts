export function getPageNumbers(
  current: number,
  total: number,
  siblingCount: number
) {
  const pages: number[] = []

  const start = Math.max(1, current - siblingCount)
  const end = Math.min(total, current + siblingCount)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}
