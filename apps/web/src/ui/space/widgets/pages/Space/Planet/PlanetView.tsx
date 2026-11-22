'use client'

import type { RefObject } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import type { Id } from '@stardust/core/global/structures'
import type { Star as StarEntity } from '@stardust/core/space/entities'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { AnimatedSign } from './AnimatedSign'
import { PlanetLock } from './PlanetLock'
import { Star } from './Star'

export type Props = {
  planetId: Id
  name: string
  concept: string | null
  image: string
  state: 'locked' | 'liberated' | 'opened'
  stars: StarEntity[]
  completedStarsCount: number
  starsCount: number
  previousPlanetName: string | null
  isOpenable: boolean
  isOpening: boolean
  isJustOpened: boolean
  isCurrent: boolean
  isAnimated: boolean
  currentItemRef: RefObject<HTMLDivElement | null>
  onOpen: () => void
}

const SIGN_TONE = {
  opened: 'success',
  liberated: 'reward',
  locked: 'quiet',
} as const

function DecorativeIcon({ name }: { name: 'lock' | 'checked' | 'start' }) {
  return (
    <span aria-hidden='true' className='inline-flex shrink-0'>
      <Icon name={name} size={16} />
    </span>
  )
}

function PlanetBadge({ state }: Pick<Props, 'state'>) {
  if (state === 'opened') {
    return (
      <span className='col-start-2 row-start-1 flex items-center gap-1.5 text-sm font-medium text-theme-success'>
        <DecorativeIcon name='checked' />
        Aberto
      </span>
    )
  }

  if (state === 'liberated') {
    return (
      <span className='col-start-2 row-start-1 text-xs font-medium text-theme-reward lg:col-span-2 lg:col-start-1 lg:row-start-3'>
        Próximo passo
      </span>
    )
  }

  return null
}

function PlanetProgress({
  state,
  concept,
  previousPlanetName,
  completedStarsCount,
  starsCount,
}: Pick<
  Props,
  'state' | 'concept' | 'previousPlanetName' | 'completedStarsCount' | 'starsCount'
>) {
  if (state === 'locked') {
    return (
      <span className='col-span-2 row-start-2 flex items-start gap-1.5 text-xs text-theme-text-secondary'>
        <span className='mt-px'>
          <DecorativeIcon name='lock' />
        </span>
        <span>
          Conclua {previousPlanetName ?? 'o planeta anterior'} para liberar ·{' '}
          {completedStarsCount} de {starsCount}
        </span>
      </span>
    )
  }

  return (
    <span
      className={twMerge(
        'col-span-2 row-start-2 text-xs',
        state === 'opened' ? 'text-theme-accent-text' : 'text-theme-text-secondary',
      )}
    >
      {concept && <span>{concept}</span>}
      {concept && <span aria-hidden='true'> · </span>}
      <span className='hidden lg:inline'>
        {completedStarsCount} de {starsCount} estrelas concluídas
      </span>
      <span className='lg:hidden'>
        {completedStarsCount} de {starsCount} concluídas
      </span>
    </span>
  )
}

function PlanetAction({ state }: Pick<Props, 'state'>) {
  if (state !== 'liberated') return null

  return (
    <span className='col-span-2 row-start-4 mt-2 flex h-theme-control w-fit items-center gap-theme-control-gap rounded-theme bg-theme-action px-theme-control-x text-sm font-medium text-theme-canvas'>
      <DecorativeIcon name='start' />
      Abrir planeta
    </span>
  )
}

function PlanetSign(props: Props) {
  const { name, state } = props

  return (
    <AnimatedSign tone={SIGN_TONE[state]}>
      <span className='grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 text-left'>
        <span className='col-start-1 row-start-1 flex items-center gap-3'>
          <strong className='text-lg font-semibold text-theme-text-primary'>
            {name}
          </strong>
        </span>
        <PlanetBadge state={state} />
        <PlanetProgress
          state={state}
          concept={props.concept}
          previousPlanetName={props.previousPlanetName}
          completedStarsCount={props.completedStarsCount}
          starsCount={props.starsCount}
        />
        <PlanetAction state={state} />
      </span>
    </AnimatedSign>
  )
}

const ART_BOX_CLASS =
  'relative block h-[88px] w-[88px] shrink-0 lg:h-[140px] lg:w-[140px]'

function PlanetArtLock(props: Pick<Props, 'state' | 'isJustOpened'>) {
  return (
    <span className='absolute inset-0 grid place-content-center'>
      <PlanetLock planetState={props.state} isJustOpened={props.isJustOpened} />
    </span>
  )
}

function PlanetArt(
  props: Pick<Props, 'image' | 'state' | 'isJustOpened' | 'isAnimated'>,
) {
  const dimmedClass = props.state !== 'opened' && 'opacity-50'

  return (
    <span className={ART_BOX_CLASS}>
      <Image
        src={props.image}
        width={140}
        height={140}
        sizes='(min-width: 1024px) 140px, 88px'
        unoptimized={props.isAnimated}
        alt=''
        className={twMerge('transition-opacity', dimmedClass)}
      />
      <PlanetArtLock state={props.state} isJustOpened={props.isJustOpened} />
    </span>
  )
}

function PlanetBody(props: Props) {
  return (
    <span className='flex items-center gap-3 text-left'>
      <PlanetArt {...props} />
      <PlanetSign {...props} />
    </span>
  )
}

function PlanetHeader(props: Props) {
  const { name, isOpenable, isOpening, onOpen } = props

  if (!isOpenable) {
    return (
      <div>
        <PlanetBody {...props} />
      </div>
    )
  }

  return (
    <button
      type='button'
      aria-label={`Abrir planeta ${name}`}
      aria-busy={isOpening}
      onClick={onOpen}
      className='block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-action'
    >
      <PlanetBody {...props} />
    </button>
  )
}

function PlanetStars({ planetId, stars }: Pick<Props, 'planetId' | 'stars'>) {
  return (
    <ul className='pl-[2.2rem]'>
      {stars.map((star, index) => (
        <li key={star.id.value}>
          <Star
            id={star.id}
            planetId={planetId}
            name={star.name}
            number={star.number}
            isChallenge={star.isChallenge.isTrue}
            previousStarNumber={stars[index - 1]?.number.value ?? null}
          />
        </li>
      ))}
    </ul>
  )
}

export const PlanetView = (props: Props) => {
  const { isCurrent, currentItemRef, planetId, stars } = props

  return (
    <div>
      <div ref={isCurrent ? currentItemRef : null}>
        <PlanetHeader {...props} />
      </div>
      <PlanetStars planetId={planetId} stars={stars} />
    </div>
  )
}
