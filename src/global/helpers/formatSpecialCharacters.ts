import { SPECIAL_CHARACTERS } from '../constants'

type Action = 'encode' | 'decode'

export function formatSpecialCharacters(code: string, action: Action) {
  const decodeCharacters = Object.keys(SPECIAL_CHARACTERS)
  const encodeCharacters = Object.values(SPECIAL_CHARACTERS)

  if (action === 'decode') {
    let dencodedText = code

    encodeCharacters.forEach((encodeCharacter, index) => {
      dencodedText = dencodedText.replace(
        new RegExp(encodeCharacter, 'g'),
        decodeCharacters[index]
      )
    })

    return dencodedText
  } else if (action === 'encode') {
    let encodedText = code

    decodeCharacters.forEach((decodeCharacter, index) => {
      encodedText = encodedText.replace(
        new RegExp(decodeCharacter, 'g'),
        encodeCharacters[index]
      )
    })

    return encodedText
  }

  return code
}
