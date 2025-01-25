'use client'

import { useRef } from 'react'

import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'
import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { useEndingPage } from './useEndingPage'
import { AnimatedProgressBar } from '@/ui/global/widgets/components/AnimatedProgressBar'

const TEXTS = ['texto 1', 'texto 2', 'texto 3']

export function EndingPage() {
  const progressBarRef = useRef<AnimatedProgressBarRef>(null)
  const { activeTextIndex } = useEndingPage(progressBarRef)

  return (
    <div>
      <div className='fixed z-[-5] brightness-[0.25]'>
        <Animation name='rocket-exploring' size='full' hasLoop={true} />
      </div>

      <main>
        <AnimatedProgressBar ref={progressBarRef} value={0} height={40} />

        {TEXTS.map((text, textIndex) => {
          return (
            <AnimatedOpacity
              key={text}
              isVisible={textIndex === activeTextIndex}
              delay={0.5}
            >
              {text}
            </AnimatedOpacity>
          )
        })}
      </main>
    </div>
  )
}
