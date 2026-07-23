export function collectOptionValues(value: string, previous: string[] = []): string[] {
  return [...previous, value]
}
