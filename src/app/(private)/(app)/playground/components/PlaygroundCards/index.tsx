'use client'

import { PlaygroundCard } from '../PlaygroundCard'

import { usePlaygroundCards } from './usePlaygroundCards'

import type { Playground } from '@/@types/Playground'
import { Loading } from '@/global/components/Loading'

type PlaygroundCardsProps = {
  initialPlaygrounds: Playground[]
}

export function PlaygroundCards({ initialPlaygrounds }: PlaygroundCardsProps) {
  const { handleDeletePlaygroundCard, playgroundCards, isLoading } =
    usePlaygroundCards(initialPlaygrounds)

  return (
    <div className="mx-auto mt-3 max-w-4xl">
      {isLoading ? (
        <div className="grid place-content-center">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {playgroundCards?.map((playgroundCard) => (
            <PlaygroundCard
              key={playgroundCard.id}
              id={playgroundCard.id}
              title={playgroundCard.title}
              onDelete={handleDeletePlaygroundCard}
            />
          ))}
        </div>
      )}
    </div>
  )
}
