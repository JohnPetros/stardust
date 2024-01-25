import { SPECIAL_CHARACTERS } from '../constants'

type Action = 'encode' | 'decode'

export function formatCode(code: string, action: Action) {
  const encodeCharacters = Object.keys(SPECIAL_CHARACTERS)
  const decodeCharacters = Object.values(SPECIAL_CHARACTERS)

  if (action === 'decode')
    return code.replace(
      new RegExp(decodeCharacters[0], 'g'),
      encodeCharacters[0]
    )
  else
    return code.replace(
      new RegExp(encodeCharacters[0], 'g'),
      decodeCharacters[0]
    )
}
