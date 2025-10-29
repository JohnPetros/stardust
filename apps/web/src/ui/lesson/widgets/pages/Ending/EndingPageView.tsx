'use client'

import Link from 'next/link'
import type { RefObject } from 'react'

import type { NavigationProvider } from '@stardust/core/global/interfaces'

import { ROUTES } from '@/constants'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { AnimatedProgressBar } from '@/ui/global/widgets/components/AnimatedProgressBar'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ThanksToDeleguaTeam } from './ThanksToDeleguaTeam'
import { ThanksToEtec } from './ThanksToEtec'
import { ThanksToFamily } from './ThanksToFamily'
import { ThanksToUser } from './ThanksToUser'
import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'

type Props = {
  progressBarRef: RefObject<AnimatedProgressBarRef | null>
  activeThankIndex: number
  lastThankIndex: number
  navigationProvider: NavigationProvider
  onProgressBarAnimationEnd: () => void
  onSkipTextButtonClick: () => void
}

export const EndingPageView = ({
  progressBarRef,
  activeThankIndex,
  lastThankIndex,
  navigationProvider,
  onProgressBarAnimationEnd,
  onSkipTextButtonClick,
}: Props) => {
  return (
    <div className='h-screen'>
      <div className='fixed z-[-5] brightness-[0.25]'>
        <AnimatedOpacity delay={0.5} className='text-gray-50 text-center'>
          <Animation name='space' size='full' hasLoop={true} />
        </AnimatedOpacity>
      </div>

      <main className='flex flex-col h-full mx-auto max-w-2xl px-6 md:px-0'>
        {lastThankIndex !== activeThankIndex && (
          <AnimatedProgressBar
            key={activeThankIndex}
            ref={progressBarRef}
            value={0}
            height={12}
            onAnimationEnd={onProgressBarAnimationEnd}
          />
        )}
        {lastThankIndex === activeThankIndex && (
          <button type='button' onClick={navigationProvider.refresh}>
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
            <Button onClick={onSkipTextButtonClick}>Continuar</Button>
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
