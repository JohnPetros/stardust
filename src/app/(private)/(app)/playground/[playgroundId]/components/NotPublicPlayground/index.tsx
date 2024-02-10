'use client'

import Lottie from 'lottie-react'
import Link from 'next/link'

import ApolloDenying from '../../../../../../../../public/animations/apollo-denying.json'

import { ROUTES } from '@/global/constants'

export function NotPublicPlayground() {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <main className="flex flex-col items-center space-y-8">
        <Lottie
          animationData={ApolloDenying}
          style={{ width: 220 }}
          loop={true}
        />

        <h1 className="text-xl font-semibold text-gray-100">
          Esse playground não está disponível!
        </h1>
        <p className="font-medium text-gray-300">
          Clique{' '}
          <Link
            href={ROUTES.private.playground + '/new'}
            className="font-semibold text-green-600"
          >
            aqui
          </Link>{' '}
          para criar o seu próprio playground.
        </p>
      </main>
    </div>
  )
}
