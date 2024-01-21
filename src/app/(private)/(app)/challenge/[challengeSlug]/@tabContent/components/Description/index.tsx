'use client'

import { useDescription } from './useDescription'

import { Loading } from '@/app/components/Loading'
import { Mdx } from '@/app/components/Mdx'

export function Description() {
  const { mdx, isLoading } = useDescription()

  return isLoading ? (
    <div className="grid h-full place-content-center">
      <Loading />
    </div>
  ) : (
    <div className="space-y-12 p-6">
      <Mdx>{mdx}</Mdx>
    </div>
  )
}
