export function getItemWidth(itemLabel: string) {
  const { length } = itemLabel
  const base = length < 10 ? 2.5 : 3
  return `${base + length / 2}rem`
}
