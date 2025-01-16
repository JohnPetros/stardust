'use client'

import { ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import Link from 'next/link'

export function AddSnippetButton() {
  return (
    <Button asChild className='w-max'>
      <Link
        href={ROUTES.playground.snippet()}
        className='flex w-max items-center gap-1 px-3 text-sm'
      >
        <Icon
          name='plus-circle'
          size={20}
          className='text-lg text-gray-900'
          weight='bold'
        />
        Criar Novo Snippet
      </Link>
    </Button>
  )
}
