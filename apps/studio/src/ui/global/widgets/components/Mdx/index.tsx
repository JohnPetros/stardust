import Markdown from 'markdown-to-jsx'

import { Alert } from './Alert'
import { Code } from './Code'
import { CodeLine } from './CodeLine'
import { Image } from './Image'
import { Link } from './Link'
import { Quote } from './Quote'
import { Strong } from './Strong'
import { Text } from './Text'
import { User } from './User'
import { useMdx } from './useMdx'
import { cn } from '@/ui/shadcn/utils'

type MdxProps = {
  children: string
  className?: string
}

export function Mdx({ children, className }: MdxProps) {
  const { formatCodeContent } = useMdx()
  const mdx = formatCodeContent(children)

  return (
    <div className={cn('prose prose-invert max-w-[80ch] [&>div]:space-y-6', className)}>
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
              component: CodeLine,
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
        {mdx}
      </Markdown>
    </div>
  )
}
