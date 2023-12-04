export function reorderItems<T>(items: T[]) {
  const originalItems = [...items]
  const reorderedOptions = originalItems.sort(() => {
    return Math.random() - 0.5
  })

  return reorderedOptions
}
