'use client'

import { ROUTES } from '@/constants'
import { PlusCircle } from '@phosphor-icons/react'
import { Button } from '@radix-ui/react-toolbar'
import Link from 'next/link'

export function AddSnippetButton() {
  return (
    <Button asChild className='w-max'>
      <Link
        href={ROUTES.playground.snippet()}
        className='flex w-max items-center gap-2 px-3 text-sm'
      >
        <PlusCircle className='text-lg text-gray-900' weight='bold' />
        Criar Novo Snippet
      </Link>
    </Button>
  )
}
