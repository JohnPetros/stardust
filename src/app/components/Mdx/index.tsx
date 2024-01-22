'use client'

import Markdown from 'markdown-to-jsx'

import { Alert } from './Alert'
import { Code } from './Code'
import { Image } from './Image'
import { Picture } from './Picture'
import { Quote } from './Quote'
import { Text } from './Text'
import { User } from './User'

type MdxProps = {
  children: string
}

export function Mdx({ children }: MdxProps) {
  return (
    <Markdown
      options={{
        overrides: {
          Text: {
            component: Text,
          },
          Alert: {
            component: Alert,
          },
          Quote: {
            component: Quote,
          },
          Image: {
            component: Image,
          },
          User: {
            component: User,
          },
          Code: {
            component: Code,
          },
          Picture: {
            component: Picture,
          },
          code: {
            component: Code,
          },
        },
      }}
    >
      {children}
    </Markdown>
  )
}
