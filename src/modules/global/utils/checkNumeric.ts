import { REGEX } from '../../../global/constants'

export function checkNumeric(value: string) {
  return REGEX.numeric.test(value)
}
