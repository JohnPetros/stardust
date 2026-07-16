'use client'

import Link from 'next/link'
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type HTMLAttributes,
} from 'react'
import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'

type ExternalProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined
}

export type Props = {
  href: string
  title: string
  isActive: boolean
  isBlocked: boolean
} & ExternalProps

const View = (
  { href, title, isActive, isBlocked, className, ...rest }: Props,
  ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
) => {
  const buttonProps = rest as ComponentPropsWithoutRef<'button'>
  const linkProps = rest as ComponentPropsWithoutRef<'a'>

  if (isBlocked) {
    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type='button'
        className={twMerge(
          'flex items-center gap-2 rounded-md bg-gray-700 p-2 text-sm text-gray-500',
          className,
        )}
        {...buttonProps}
      >
        {title}
        <Icon name='lock' size={16} className='text-gray-500' />
      </button>
    )
  }

  return (
    <Link
      ref={ref as ForwardedRef<HTMLAnchorElement>}
      href={href}
      className={twMerge(
        'rounded-md bg-gray-700 p-2 text-sm',
        isActive ? 'p-2 text-green-500' : 'text-gray-100',
        className,
      )}
      {...linkProps}
    >
      {title}
    </Link>
  )
}

export const ChallengeContentLinkView = forwardRef(View)
