import { FunctionComponent } from 'react'
import { render } from '@react-email/components'

export function renderTemplate<
  TemplateProps extends JSX.ElementAttributesProperty,
>(Template: FunctionComponent<TemplateProps>, props: TemplateProps) {
  return render(<Template {...props} />)
}
