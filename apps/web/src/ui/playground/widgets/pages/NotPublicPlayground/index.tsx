'use client'

import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Animation } from '@/ui/global/widgets/components/Animation'

export function NotPublicSnippetPage() {
  return (
    <div className='grid h-screen w-screen place-content-center'>
      <main className='flex flex-col items-center space-y-8'>
        <Animation name='apollo-denying' size={220} hasLoop />

        <h1 className='text-xl font-semibold text-gray-100'>
          Esse playground não está disponível!
        </h1>
        <p className='font-medium text-gray-300'>
          Clique{' '}
          <Link
            href={ROUTES.playground.snippet()}
            className='font-semibold text-green-600'
          >
            aqui
          </Link>{' '}
          para criar o seu próprio playground.
        </p>
      </main>
    </div>
  )
}
