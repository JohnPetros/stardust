export function getComponentContent(component: string) {
  const regex = '>(.*?)</'

  const match = component.match(new RegExp(regex, 's'))
  return match ? match[1] : ''
}
