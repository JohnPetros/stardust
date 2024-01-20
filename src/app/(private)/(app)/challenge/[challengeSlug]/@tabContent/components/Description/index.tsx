'use client'

import { useDescription } from './useDescription'

import { Mdx } from '@/app/components/Mdx'

export function Description() {
  const { mdx } = useDescription()

  return (
    <div className="space-y-12 p-6">
      <Mdx>{mdx}</Mdx>
    </div>
  )
}
