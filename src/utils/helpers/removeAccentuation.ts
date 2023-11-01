export function removeAccentuation(word: string) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
