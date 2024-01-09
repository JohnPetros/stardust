import { ReactElement } from 'react'
import { render } from '@react-email/components'

export function renderTemplate(template: ReactElement) {
  return render(template)
}
