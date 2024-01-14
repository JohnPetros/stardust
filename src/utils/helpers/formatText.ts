import { REGEX } from '../constants'

export function formatText(text: string) {
  console.log({ text })
  const backticksRegex = REGEX.backticks
  return text.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>')
}
