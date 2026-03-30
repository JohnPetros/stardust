import { Children, isValidElement, type ReactNode } from 'react'

import { Alert } from '../Alert'
import { Code } from '../Code'
import { Image } from '../Image'
import { Quote } from '../Quote'
import { Text } from '../Text'
import { User } from '../User'

type Props = {
  children?: ReactNode
}

export const ParagraphView = ({ children }: Props) => {
  const shouldRenderAsDiv = Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      [Alert, Code, Image, Quote, Text, User].some(
        (component) => child.type === component,
      ),
  )

  if (shouldRenderAsDiv) {
    return <div>{children}</div>
  }

  return <p>{children}</p>
}
