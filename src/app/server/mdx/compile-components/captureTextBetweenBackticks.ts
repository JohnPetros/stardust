import { REGEX } from '@/global/constants'
const backticksRegex = REGEX.backticks

export function captureTextBetweenBackticks(text: string) {
  const matches = Array.from(text.matchAll(backticksRegex), (match) => match[1])

  return matches
}
