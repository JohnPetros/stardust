import Markdown from 'markdown-to-jsx'

import { Alert } from './Alert'
import { Code } from './Code'
import { Image } from './Image'
import { Link } from './Link'
import { Quote } from './Quote'
import { Strong } from './Strong'
import { Text } from './Text'
import { User } from './User'
import { CodeLine } from './CodeLine'
import { Paragraph } from './Paragraph'
import type { LessonCodeExplanation } from '../CodeSnippet'

type Props = {
  children: string
  lessonCodeExplanation?: LessonCodeExplanation
}

export const MdxView = ({ children, lessonCodeExplanation }: Props) => {
  return (
    <div className='prose prose-invert max-w-[80ch]'>
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
              component: (props) => (
                <Code {...props} lessonCodeExplanation={lessonCodeExplanation} />
              ),
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
            p: {
              component: Paragraph,
            },
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
