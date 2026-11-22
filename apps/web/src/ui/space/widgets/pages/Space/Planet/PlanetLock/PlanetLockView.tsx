import { motion } from 'motion/react'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { Icon } from '@/ui/global/widgets/components/Icon'

import type { PlanetLockPhase } from './usePlanetLock'

const LOCK_SIZE_IN_PX = 64

export type Props = {
  phase: PlanetLockPhase
  hasLoadFailed: boolean
  onLoadError: () => void
}

function FallbackLock() {
  return <Icon name='lock' size={32} className='text-theme-text-secondary' />
}

type LockAnimationProps = Pick<Props, 'hasLoadFailed' | 'onLoadError'> & {
  isStatic: boolean
}

function LockAnimation({ hasLoadFailed, onLoadError, isStatic }: LockAnimationProps) {
  if (hasLoadFailed) return <FallbackLock />

  return (
    <Animation
      name='planet-lock'
      size={LOCK_SIZE_IN_PX}
      isStatic={isStatic}
      hasLoop={false}
      onLoadError={onLoadError}
    />
  )
}

function FadingLock() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FallbackLock />
    </motion.div>
  )
}

function LoopingLock(props: Omit<LockAnimationProps, 'isStatic'>) {
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <LockAnimation {...props} isStatic />
    </motion.div>
  )
}

export function PlanetLockView({ phase, hasLoadFailed, onLoadError }: Props) {
  if (phase === 'hidden') return null

  const animationProps = { hasLoadFailed, onLoadError }

  return (
    <div
      aria-hidden='true'
      data-phase={phase}
      className='pointer-events-none grid h-[64px] w-[64px] place-content-center'
    >
      {phase === 'fade' && <FadingLock />}
      {phase === 'opening' && <LockAnimation {...animationProps} isStatic={false} />}
      {phase === 'loop' && <LoopingLock {...animationProps} />}
      {phase === 'static' && <LockAnimation {...animationProps} isStatic />}
    </div>
  )
}
