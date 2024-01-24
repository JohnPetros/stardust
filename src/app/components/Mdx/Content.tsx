import { ReactNode } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

import { TypeWriter } from '../TypeWriter'

import { formatCode, formatText } from '@/utils/helpers'

const contentStyles = tv({
  base: 'font-medium tracking-wider text-gray-100 text-sm w-full p-3 rounded-md',
  variants: {
    type: {
      default: 'bg-purple-700',
      alert: 'bg-yellow-400 text-yellow-900',
      quote: 'bg-blue-700 border-l-4 border-blue-300 text-blue-300',
      list: 'border-green-400 text-green-400',
      user: 'bg-green-400 text-green-900 font-semibold ml-auto mr-4 w-max',
    },
  },
})

type ContentProps = {
  hasAnimation: boolean
  children: string | ReactNode
}

export function Content({
  type,
  children,
  hasAnimation,
}: ContentProps & VariantProps<typeof contentStyles>) {
  console.log(children)

  return (
    <div className={contentStyles({ type })}>
      <p className="not-prose leading-6">
        {typeof children === 'string' ? (
          <>
            {hasAnimation ? (
              <TypeWriter text={formatText(children)} isEnable={hasAnimation} />
            ) : (
              <span
                dangerouslySetInnerHTML={{
                  __html: formatText(children),
                }}
              />
            )}
          </>
        ) : (
          children
        )}
      </p>
    </div>
  )
}
