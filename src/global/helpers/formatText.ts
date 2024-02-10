import { REGEX } from '../constants'

export function formatText(text: string) {
  const { betweenTwoAsterisks, betweenFourAsterisks } = REGEX
  const strongComponent = '<span class="strong">$1</span>'

  return text.replace(betweenTwoAsterisks, strongComponent).replace(betweenFourAsterisks, strongComponent)
}
