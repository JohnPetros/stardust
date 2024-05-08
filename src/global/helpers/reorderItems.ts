export function reorderItems<Item>(items: Item[]) {
  const originalItems = [...items]
  const reorderedOptions = originalItems.sort(() => {
    return Math.random() - 0.5
  })

  return reorderedOptions
}
