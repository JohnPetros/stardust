'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useChallenge } from '@/hooks/useChallenge'
import { useAuth } from '@/hooks/useAuth'

import { Slider } from '@/app/components/Slider'
import { Slide } from '@/app/components/Slider/Slide'
import { Header } from './components/Header'
import { Problem } from './components/Problem'
import { Code } from './components/Code'
import { Result } from './components/Result'

type Tab = 'problem' | 'code' | 'result'

export default function Challenge() {
  const { challengeId } = useParams()
  const { user } = useAuth()

  const { challenge } = useChallenge({
    challengeId: String(challengeId),
    userId: user?.id,
  })

  const [currentTab, setCurrentTab] = useState<Tab>('result')

  if (challenge)
    return (
      <div className="h-full">
        <Header challengeTitle="Pedido de ajuda" />
        <main className="h-full">
          <Slider onChange={null}>
            {currentTab === 'problem' && (
              <Slide id={'problem'}>
                <Problem texts={challenge.texts} />
              </Slide>
            )}
            {currentTab === 'code' && (
              <Slide id={'code'}>
                <Code code={challenge.code} />
              </Slide>
            )}

            {currentTab === 'result' && (
              <Slide id={'result'}>
                <Result testCases={challenge.test_cases} />
              </Slide>
            )}
          </Slider>
        </main>
      </div>
    )
}
