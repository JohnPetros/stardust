export function getRandomItem<Item>(items: Item[]) {
  return items[Math.floor(Math.random() * items.length)]
}
