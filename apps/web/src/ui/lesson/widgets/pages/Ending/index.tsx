'use client'

import Link from 'next/link'
import { useRef } from 'react'

import { ROUTES } from '@/constants'
import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'
import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { AnimatedProgressBar } from '@/ui/global/widgets/components/AnimatedProgressBar'
import { Button } from '@/ui/global/widgets/components/Button'
import { useEndingPage } from './useEndingPage'
import { ThanksToUser } from './ThanksToUser'
import { ThanksToDeleguaTeam } from './ThanksToDeleguaTeam'
import { ThanksToFamily } from './ThanksToFamily'
import { ThanksToEtec } from './ThanksToEtec'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useRouter } from '@/ui/global/hooks/useRouter'

export function EndingPage() {
  const progressBarRef = useRef<AnimatedProgressBarRef>(null)
  const {
    activeThankIndex,
    lastThankIndex,
    handleProgressBarAnimationEnd,
    handleSkipTextButtonClick,
  } = useEndingPage(progressBarRef)
  const router = useRouter()

  return (
    <div className='h-screen'>
      <div className='fixed z-[-5] brightness-[0.25]'>
        <AnimatedOpacity delay={0.5} className='text-gray-50 text-center'>
          <Animation name='rocket-exploring' size='full' hasLoop={true} />
        </AnimatedOpacity>
      </div>

      <main className='flex flex-col h-full mx-auto max-w-2xl'>
        {lastThankIndex !== activeThankIndex && (
          <AnimatedProgressBar
            key={activeThankIndex}
            ref={progressBarRef}
            value={0}
            height={12}
            onAnimationEnd={handleProgressBarAnimationEnd}
          />
        )}
        {lastThankIndex === activeThankIndex && (
          <button type='button' onClick={router.refresh}>
            <Icon name='reload' className='text-gray-50 mt-3' />
          </button>
        )}

        <div className='flex-1 mt-16 overflow-hidden'>
          <AnimatedOpacity
            isVisible={activeThankIndex === 0}
            delay={0.7}
            className='space-y-6 text-gray-50'
          >
            <ThanksToUser />
          </AnimatedOpacity>
          <AnimatedOpacity
            isVisible={activeThankIndex === 1}
            delay={0.7}
            className='space-y-6 text-gray-50'
          >
            <ThanksToEtec />
          </AnimatedOpacity>
          <AnimatedOpacity
            isVisible={activeThankIndex === 2}
            delay={0.7}
            className='space-y-6 text-gray-50'
          >
            <ThanksToDeleguaTeam />
          </AnimatedOpacity>
          <AnimatedOpacity
            isVisible={activeThankIndex === 3}
            delay={0.7}
            className='space-y-6 text-gray-50'
          >
            <ThanksToFamily />
          </AnimatedOpacity>
        </div>

        <div className='mx-auto w-48 pb-12'>
          {lastThankIndex !== activeThankIndex && (
            <Button onClick={handleSkipTextButtonClick}>Continuar</Button>
          )}
          {lastThankIndex === activeThankIndex && (
            <Button asChild>
              <Link href={ROUTES.space}>Continuar</Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
