import { SPECIAL_CHARACTERS } from '../constants'

type Action = 'encode' | 'decode'

export function formatCode(code: string, action: Action) {
  const encodeCharacters = Object.keys(SPECIAL_CHARACTERS)
  const decodeCharacters = Object.values(SPECIAL_CHARACTERS)

  if (action === 'decode')
    return code
      .replace(new RegExp(decodeCharacters[0], 'g'), encodeCharacters[0])
      .replace(new RegExp(decodeCharacters[1], 'g'), encodeCharacters[1])
      .replace(new RegExp(decodeCharacters[2], 'g'), encodeCharacters[2])
  else
    return code
      .replace(new RegExp(encodeCharacters[0], 'g'), decodeCharacters[0])
      .replace(new RegExp(encodeCharacters[1], 'g'), decodeCharacters[1])
      .replace(new RegExp(encodeCharacters[2], 'g'), decodeCharacters[2])
}
