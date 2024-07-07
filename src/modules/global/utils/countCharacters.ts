export function countCharacters(characters: string, text: string) {
  let count = 0

  for (let i = 0; i < text.length; i++) {
    if (characters === text.slice(i, characters.length + i)) count++
  }

  return count
}
