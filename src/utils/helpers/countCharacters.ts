export function countCharacters(character: string, text: string) {
  let count = 0

  for (let i = 0; i < text.length; i++) {
    if (character === text[i]) count++
  }

  return count
}
