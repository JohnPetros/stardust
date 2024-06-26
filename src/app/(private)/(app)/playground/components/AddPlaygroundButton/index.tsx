'use client'

import { PlusCircle } from '@phosphor-icons/react'
import Link from 'next/link'

import { Button } from '@/global/components/Button'
import { ROUTES } from '@/global/constants'

export function AddPlaygroundButton() {
  return (
    <Button asChild className="w-max">
      <Link
        href={`${ROUTES.private.playground}/new`}
        className="flex w-max items-center gap-2 px-3 text-sm"
      >
        <PlusCircle className="text-lg text-gray-900" weight="bold" />
        Criar Novo Código Playground
      </Link>
    </Button>
  )
}
