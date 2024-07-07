export function deslugify(slug: string) {
  const words = slug.split('-')

  const name = words
    .map((word) => {
      const firstLetter = word[0].toUpperCase()
      return firstLetter + word.slice(1)
    })
    .join(' ')

  return name
}
