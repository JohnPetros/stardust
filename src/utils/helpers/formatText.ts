import { REGEX } from '../constants'

export function formatText(text: string) {
  const backticksRegex = REGEX.backticks
  return text.replace(backticksRegex, '<span class="inline-code">$1</span>')
}
