'use client'

import { ArrowLeft } from '@phosphor-icons/react'

import { useHeader } from './useHeader'

import type { Challenge } from '@/@types/challenge'
import type { Vote } from '@/@types/vote'
import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'

type HeaderProps = {
  challenge: Challenge
  userVote: Vote
}

export function Header({ challenge, userVote }: HeaderProps) {
  const { handleBackButton } = useHeader(challenge, userVote)

  return (
    <header className="flex h-12 flex-col justify-center md:border-b md:border-green-700">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-3 py-3">
          <Alert
            type="crying"
            title="Você está saindo do desafio!"
            body={
              <div className="text-center">
                <p className="text-gray-300">
                  Você tem certeza que deseja sair do desafio?
                </p>
                <p className="text-red-700">
                  Todo o seu progresso será perdido!
                </p>
              </div>
            }
            action={
              <Button
                onClick={handleBackButton}
                className="bg-red-700 text-gray-100"
              >
                Sair
              </Button>
            }
            cancel={
              <Button autoFocus className="bg-green-400 text-gray-900">Ficar</Button>
            }
            canPlaySong={false}
          >
            <button className="translate-y-1">
              <ArrowLeft className="text-xl text-green-400" weight="bold" />
            </button>
          </Alert>
          <h2 className="text-lg font-semibold text-gray-100">
            {challenge.title}
          </h2>
        </div>
        <div></div>
      </div>
    </header>
  )
}
