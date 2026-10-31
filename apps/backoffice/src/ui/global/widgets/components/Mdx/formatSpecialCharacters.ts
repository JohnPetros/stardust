import { SPECIAL_CHARACTERS } from './special-characters'

type Action = 'encode' | 'decode'

export function formatSpecialCharacters(code: string, action: Action) {
  const decodeCharacters = Object.keys(SPECIAL_CHARACTERS)
  const encodeCharacters = Object.values(SPECIAL_CHARACTERS)

  if (action === 'decode') {
    let dencodedText = code

    encodeCharacters.forEach((encodeCharacter, index) => {
      if (decodeCharacters[index])
        dencodedText = dencodedText.replace(
          new RegExp(encodeCharacter, 'g'),
          decodeCharacters[index],
        )
    })

    return dencodedText
  }
  if (action === 'encode') {
    let encodedText = code

    decodeCharacters.forEach((decodeCharacter, index) => {
      if (encodeCharacters[index])
        encodedText = encodedText.replace(
          new RegExp(decodeCharacter, 'g'),
          encodeCharacters[index],
        )
    })

    return encodedText
  }

  return code
}
