export function calculateSupabaseRange(page: number, itemsPerPage: number) {
  const offset = (page - 1) * itemsPerPage

  return {
    from: offset,
    to: offset + itemsPerPage - 1,
  }
}
