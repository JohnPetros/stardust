export function calculateSupabaseRange(page: number, itemsPerPage: number) {
  console.log({ page })
  console.log({ itemsPerPage })
  const offset = (page - 1) * itemsPerPage

  return {
    from: offset,
    to: offset + itemsPerPage - 1,
  }
}
