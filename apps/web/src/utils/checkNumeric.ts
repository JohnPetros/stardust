import { REGEX } from '../../../constants'

export function checkNumeric(value: string) {
  return REGEX.numeric.test(value)
}
