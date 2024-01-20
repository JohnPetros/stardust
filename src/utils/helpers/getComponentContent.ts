import { REGEX } from '../constants'

const componentNameRegex = REGEX.componentName

export function getComponentContent(component: string) {
  const nameMatch = componentNameRegex.exec(component)
  const componentName = nameMatch ? nameMatch[1] : 'Text'

  const componentRegex = new RegExp(
    `<${componentName}[^>]*>([\\s\\S]*?)</${componentName}>`,
    'g'
  )

  const contentMatch = componentRegex.exec(component)
  if (contentMatch !== null) {
    return contentMatch[1]
  }
}
