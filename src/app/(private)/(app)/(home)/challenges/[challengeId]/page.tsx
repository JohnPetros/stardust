'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useChallenge } from '@/hooks/useChallenge'

import { Slider } from '@/app/components/Slider'
import { Slide } from '@/app/components/Slider/Slide'
import { Header } from './components/Header'
import { Problem } from './components/Problem'
import { useAuth } from '@/hooks/useAuth'

type Tab = 'problem' | 'code' | 'result'

export default function Challenge() {
  const { challengeId } = useParams()
  const { user } = useAuth()

  const { challenge } = useChallenge({
    challengeId: String(challengeId),
    userId: user?.id,
  })

  const [currentTab, setCurrentTab] = useState<Tab>('problem')

  if (challenge)
    return (
      <div>
        <Header challengeTitle="Pedido de ajuda" />
        <main>
          <Slider onChange={null}>
            {currentTab === 'problem' && (
              <Slide id={'problem'}>
                <Problem texts={challenge.texts} />
              </Slide>
            )}
          </Slider>
        </main>
      </div>
    )
}
