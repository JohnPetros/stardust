'use client'

import { PlusCircle } from '@phosphor-icons/react'
import Link from 'next/link'

import { Button } from '@/app/components/Button'
import { ROUTES } from '@/utils/constants'

export function AddPlaygroundButton() {
  return (
    <Link href={`${ROUTES.private.playground}/new`}>
      <Button className="flex items-center gap-2 px-3 text-sm">
        <PlusCircle className="text-lg text-gray-900" weight="bold" />
        Criar Novo Código Playground
      </Button>
    </Link>
  )
}
