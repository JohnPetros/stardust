'use client'

import Markdown from 'markdown-to-jsx'

import { Alert } from './Alert'
import { Code } from './Code'
import { Image } from './Image'
import { Link } from './Link'
import { Quote } from './Quote'
import { Strong } from './Strong'
import { Text } from './Text'
import { User } from './User'

type MdxProps = {
  children: string
}

export function Mdx({ children }: MdxProps) {
  return (
    <div className="prose prose-invert">
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
            Link: {
              component: Link,
            },
            Code: {
              component: Code,
            },
            code: {
              component: Code,
              props: {
                isRunnable: false,
              },
            },
            strong: {
              component: Strong,
            },
            em: {
              component: Strong,
            },
            a: {
              component: Link,
            },
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
