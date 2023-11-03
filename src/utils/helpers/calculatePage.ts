export function calculatePage(offset: number, itemsPerPage: number) {
  return offset ? offset / itemsPerPage + 1 : 1
}
