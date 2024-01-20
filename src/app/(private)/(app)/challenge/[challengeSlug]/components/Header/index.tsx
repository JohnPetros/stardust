'use client'

import { ArrowLeft } from '@phosphor-icons/react'

import { useHeader } from './useHeader'

import type { Challenge } from '@/@types/challenge'

type HeaderProps = {
  challenge: Challenge
}

export function Header({ challenge }: HeaderProps) {
  const { handleBackButton } = useHeader(challenge)

  return (
    <header className="flex h-12 flex-col justify-center md:border-b md:border-green-700">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-3 py-3">
          <button onClick={handleBackButton}>
            <ArrowLeft className="text-xl text-green-400" weight="bold" />
          </button>
          <h2 className="text-lg font-semibold text-gray-100">
            {challenge.title}
          </h2>
        </div>
      </div>
    </header>
  )
}