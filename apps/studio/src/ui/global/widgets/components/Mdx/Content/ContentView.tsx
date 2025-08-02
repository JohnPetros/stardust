import type { ReactNode } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const contentVariants = tv({
  base: 'font-medium tracking-wider text-gray-100 text-sm font-medium w-full p-3 rounded-md not-prose leading-6 mx-auto',
  variants: {
    type: {
      default: 'bg-[#514869]',
      alert: 'bg-yellow-400 text-yellow-900 font-semibold',
      quote: 'bg-sky-950 border-l-4 border-sky-300 text-sky-100',
      list: 'border-green-400 text-green-400',
      user: 'bg-green-400 text-green-900 font-semibold ml-auto mr-4',
    },
  },
})

type Props = {
  children: string | ReactNode
}

export const ContentView = ({
  type,
  children,
}: Props & VariantProps<typeof contentVariants>) => {
  const content = Array.isArray(children)
    ? children
        .map((child) =>
          typeof child !== 'string'
            ? `<strong class="strong">${child.props.children}</strong>`
            : child,
        )
        .join(' ')
    : children

  return <div className={contentVariants({ type })}>{content}</div>
}
