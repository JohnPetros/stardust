'use client'

import type { RefObject } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { AnimatedImage } from './AnimatedImage'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { Icon } from '@/ui/global/widgets/components/Icon'

const STAR_LIGHT = '0 0 12px #ffcf31a1'
const FOCUS_CLASS_NAME =
  'rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-action'

export type Props = {
  id: string
  name: string
  number: number
  state: 'locked' | 'available' | 'completed'
  isCurrent: boolean
  isSelected: boolean
  isAccessible: boolean
  isChallenge: boolean
  typeLabel: string
  stateLabel: string | null
  unlockHint: string | null
  currentItemRef: RefObject<HTMLDivElement | null>
  starAnimationRef: RefObject<AnimationRef | null>
  onSelect: () => void
  onClick: () => void
}

function StarMarker({
  number,
  isAccessible,
  isCurrent,
  starAnimationRef,
}: Pick<Props, 'number' | 'isAccessible' | 'isCurrent' | 'starAnimationRef'>) {
  return (
    <div className='relative -mr-6 md:mr-0'>
      {isAccessible ? (
        <AnimatedImage shouldAnimate={isCurrent}>
          <Animation
            ref={starAnimationRef}
            name='unlocked-star'
            size={100}
            hasLoop={false}
          />
        </AnimatedImage>
      ) : (
        <Image
          src='/images/locked-star.svg'
          width={80}
          height={80}
          className='-mr-4 -translate-x-6 max-w-none'
          alt=''
        />
      )}
      <span
        aria-hidden='true'
        className={twMerge(
          'absolute top-[50%] block -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-yellow-700',
          isAccessible ? 'left-[26%]' : 'left-[22%]',
        )}
      >
        {number}
      </span>
    </div>
  )
}

function DecorativeIcon({
  name,
  className,
}: {
  name: 'lock' | 'checked' | 'start' | 'book' | 'code'
  className?: string
}) {
  return (
    <span aria-hidden='true' className={twMerge('inline-flex shrink-0', className)}>
      <Icon name={name} size={14} />
    </span>
  )
}

function StarStatus({
  state,
  stateLabel,
  unlockHint,
}: Pick<Props, 'state' | 'stateLabel' | 'unlockHint'>) {
  if (state === 'locked') {
    return (
      <span className='flex items-start gap-1.5 text-xs font-semibold text-theme-text-secondary'>
        <DecorativeIcon name='lock' className='mt-px' />
        {unlockHint}
      </span>
    )
  }

  return (
    <span
      className={twMerge(
        'flex items-center gap-1.5 text-xs font-semibold',
        state === 'completed' ? 'text-theme-success' : 'text-theme-reward',
      )}
    >
      <DecorativeIcon name={state === 'completed' ? 'checked' : 'start'} />
      {stateLabel}
    </span>
  )
}

const CARD_TONE_CLASS_NAME = {
  locked: 'border-theme-border-quiet',
  available: 'border-theme-reward',
  completed: 'border-theme-success',
} as const

const NAME_TONE_CLASS_NAME = {
  locked: 'text-theme-text-secondary',
  available: 'text-theme-reward',
  completed: 'text-theme-text-primary',
} as const

function StarCard(props: Props) {
  const { name, state, isChallenge, typeLabel } = props

  return (
    <div
      style={state === 'available' ? { boxShadow: STAR_LIGHT } : undefined}
      className={twMerge(
        'flex w-[260px] max-w-[calc(100vw-10rem)] flex-col items-start gap-1.5 rounded-theme border-2 bg-theme-surface px-3 py-3 text-left',
        CARD_TONE_CLASS_NAME[state],
      )}
    >
      <span className='flex items-center gap-1.5 text-xs font-medium text-theme-text-secondary'>
        <DecorativeIcon name={isChallenge ? 'code' : 'book'} />
        {typeLabel}
      </span>
      <strong className={twMerge('font-semibold', NAME_TONE_CLASS_NAME[state])}>
        {name}
      </strong>
      <StarStatus
        state={props.state}
        stateLabel={props.stateLabel}
        unlockHint={props.unlockHint}
      />
    </div>
  )
}

function StarContent(props: Props) {
  return (
    <>
      <StarMarker
        number={props.number}
        isAccessible={props.isAccessible}
        isCurrent={props.isCurrent}
        starAnimationRef={props.starAnimationRef}
      />
      <StarCard {...props} />
    </>
  )
}

function StarButton(props: Props) {
  const { id, number, name, typeLabel, stateLabel, isSelected } = props

  return (
    <button
      id={`star-${id}`}
      type='button'
      aria-label={`Estrela ${number}: ${name}, ${typeLabel}, ${stateLabel}`}
      aria-current={isSelected ? 'true' : undefined}
      onMouseEnter={props.onSelect}
      onFocus={props.onSelect}
      onClick={props.onClick}
      className={twMerge('mt-2 flex items-center gap-1 md:gap-3', FOCUS_CLASS_NAME)}
    >
      <StarContent {...props} />
    </button>
  )
}

function LockedStar(props: Props) {
  const { number, name, typeLabel, unlockHint } = props

  return (
    <fieldset
      aria-label={`Estrela ${number}: ${name}, ${typeLabel}, bloqueada. ${unlockHint}`}
      className='m-0 mt-2 flex min-w-0 items-center gap-1 border-0 p-0 md:gap-3'
    >
      <StarContent {...props} />
    </fieldset>
  )
}

export const StarView = (props: Props) => {
  const { isCurrent, isAccessible, currentItemRef } = props

  return (
    <div ref={isCurrent ? currentItemRef : null}>
      <Image
        src={`/images/${isAccessible ? 'unlocked-stardust.svg' : 'locked-stardust.svg'}`}
        width={32}
        height={isAccessible ? 118 : 123}
        alt=''
        className={twMerge('block w-8', isAccessible ? 'h-[118px]' : 'h-[123px]')}
      />
      {isAccessible ? <StarButton {...props} /> : <LockedStar {...props} />}
    </div>
  )
}
