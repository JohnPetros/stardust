import { tv, VariantProps } from 'tailwind-variants'

import { TypeWriter } from '../Text/TypeWriter'

import { formatText } from '@/utils/helpers'

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

interface ContentProps extends VariantProps<typeof contentStyles> {
  hasAnimation: boolean
  children: string
}

export function Content({ type, children, hasAnimation }: ContentProps) {
  return (
    <div className={contentStyles({ type })}>
      <p className="leading-6">
        <TypeWriter text={formatText(children)} isEnable={hasAnimation} />
      </p>
    </div>
  )
}