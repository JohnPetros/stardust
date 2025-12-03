import type { ReactNode } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { TypeWriter } from '../../TypeWriter'
import { formatSpecialCharacters } from '../formatSpecialCharacters'
import { Speaker } from '../../Speaker'

const contentStyles = tv({
  base: 'font-medium tracking-wider text-gray-100 text-sm w-full px-3 rounded-md not-prose leading-6 mx-auto',
  variants: {
    type: {
      default: 'bg-purple-700',
      alert: 'bg-yellow-400 text-yellow-900',
      quote: 'bg-blue-700 border-l-4 border-blue-300 text-blue-300',
      list: 'border-green-400 text-green-400',
      user: 'bg-green-400 text-green-900 font-semibold ml-auto mr-4',
    },
  },
})

type Props = {
  hasAnimation: boolean
  children: string | ReactNode
} & VariantProps<typeof contentStyles>

export const ContentView = ({ type, children, hasAnimation = false }: Props) => {
  const content = Array.isArray(children)
    ? children
        .map((child) =>
          typeof child !== 'string'
            ? `<strong class="strong">${child.props.children}</strong>`
            : child,
        )
        .join(' ')
    : children

  const formattedContent = formatSpecialCharacters(String(content), 'decode')

  console.log({ children })

  return (
    <div className={contentStyles({ type })}>
      {typeof content === 'string' ? (
        <div>
          <Speaker
            text={formattedContent
              .replaceAll('<strong class="strong">', '')
              .replaceAll('</strong>', '')}
          />
          <div className='py-3'>
            {hasAnimation ? (
              <TypeWriter content={content} isEnable={hasAnimation} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
            )}
          </div>
        </div>
      ) : (
        content
      )}
    </div>
  )
}
