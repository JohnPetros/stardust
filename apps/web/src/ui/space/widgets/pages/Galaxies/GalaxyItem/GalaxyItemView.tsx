import { twMerge } from 'tailwind-merge'

import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { Animation } from '@/ui/global/widgets/components/Animation'

export type Props = {
  galaxy: GalaxySummaryDto
  side: 'start' | 'end'
  animationUrl: string
  isAnimationStatic: boolean
  isPending: boolean
  onEnter: (galaxy: GalaxySummaryDto) => void
}

const CHIP_CLASS_NAME =
  'rounded-theme border px-[8px] py-[3px] text-[12px] font-semibold leading-[1.2] lg:leading-4'

type ProgressProps = {
  completedPlanetsCount: number
  planetsCount: number
}

function GalaxyProgress({ completedPlanetsCount, planetsCount }: ProgressProps) {
  const progressPercentage =
    planetsCount > 0
      ? Math.min(100, Math.round((completedPlanetsCount / planetsCount) * 100))
      : 0

  return (
    <div className='flex w-full flex-col gap-[8px]'>
      <div className='h-[8px] w-full rounded-theme bg-theme-border-quiet'>
        <div
          className='h-[8px] rounded-theme bg-theme-action'
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span className='text-[14px] font-semibold leading-[1.2] text-theme-text-primary lg:leading-5'>
        {completedPlanetsCount} de {planetsCount} planetas
      </span>
    </div>
  )
}

type IllustrationProps = Pick<Props, 'side' | 'animationUrl' | 'isAnimationStatic'> & {
  isAnnounced: boolean
}

function GalaxyIllustration({
  side,
  animationUrl,
  isAnimationStatic,
  isAnnounced,
}: IllustrationProps) {
  return (
    <div
      data-testid='galaxy-animation'
      data-static={isAnimationStatic}
      aria-hidden='true'
      className={twMerge(
        'relative z-0 -mb-[36px] h-[180px] w-[180px] shrink-0 [&>div]:!h-full [&>div]:!w-full lg:mb-0 lg:h-[260px] lg:w-[260px]',
        side === 'start' ? 'ml-[8px] lg:ml-0' : 'ml-auto mr-[8px] lg:mr-0',
        isAnnounced
          ? 'opacity-20'
          : 'transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
      )}
    >
      <Animation
        name='galaxy'
        src={animationUrl}
        size={260}
        isStatic={isAnimationStatic}
      />
    </div>
  )
}

function getPlaqueClassName(galaxy: GalaxySummaryDto) {
  const isAnnounced = galaxy.status === 'announced'

  return twMerge(
    'relative z-10 flex w-full flex-col items-start gap-[12px] rounded-theme bg-theme-surface p-[24px] text-left lg:w-[340px]',
    isAnnounced && 'border border-dashed border-theme-border-quiet',
    !isAnnounced &&
      !galaxy.isCurrent &&
      'border border-theme-border-quiet group-hover:border-theme-border',
    galaxy.isCurrent && 'border-2 border-theme-reward',
  )
}

function GalaxyChips({ galaxy }: Pick<Props, 'galaxy'>) {
  return (
    <>
      {galaxy.status === 'announced' && (
        <span
          className={twMerge(
            CHIP_CLASS_NAME,
            'border-theme-text-secondary text-theme-text-secondary',
          )}
        >
          Em breve
        </span>
      )}
      {galaxy.isCurrent && (
        <span
          className={twMerge(CHIP_CLASS_NAME, 'border-theme-reward text-theme-reward')}
        >
          Você está aqui
        </span>
      )}
    </>
  )
}

const TITLE_CLASS_NAME =
  'text-[20px] font-semibold leading-[1.2] text-theme-text-primary lg:leading-7'

function GalaxyTitle({ galaxy }: Pick<Props, 'galaxy'>) {
  if (galaxy.status === 'announced') {
    return <h2 className={TITLE_CLASS_NAME}>{galaxy.name}</h2>
  }

  return <span className={twMerge('block', TITLE_CLASS_NAME)}>{galaxy.name}</span>
}

function GalaxyPlaque({ galaxy }: Pick<Props, 'galaxy'>) {
  return (
    <div className={getPlaqueClassName(galaxy)}>
      <GalaxyChips galaxy={galaxy} />
      <GalaxyTitle galaxy={galaxy} />

      <p className='text-[14px] leading-[1.5] text-theme-text-secondary'>
        {galaxy.description}
      </p>

      {galaxy.status !== 'announced' && (
        <GalaxyProgress
          completedPlanetsCount={galaxy.completedPlanetsCount ?? 0}
          planetsCount={galaxy.planetsCount ?? 0}
        />
      )}
    </div>
  )
}

const LAYOUT_CLASS_NAME =
  'relative flex w-full flex-col lg:flex-row lg:items-center lg:gap-8'

const BUTTON_CLASS_NAME =
  'group cursor-pointer rounded-theme text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-action'

export function GalaxyItemView({
  galaxy,
  side,
  animationUrl,
  isAnimationStatic,
  isPending,
  onEnter,
}: Props) {
  const isAnnounced = galaxy.status === 'announced'
  const content = (
    <>
      <GalaxyIllustration
        side={side}
        animationUrl={animationUrl}
        isAnimationStatic={isAnimationStatic}
        isAnnounced={isAnnounced}
      />
      <GalaxyPlaque galaxy={galaxy} />
    </>
  )

  if (isAnnounced) return <article className={LAYOUT_CLASS_NAME}>{content}</article>

  return (
    <button
      type='button'
      aria-busy={isPending}
      aria-current={galaxy.isCurrent ? 'true' : undefined}
      onClick={() => onEnter(galaxy)}
      className={twMerge(
        LAYOUT_CLASS_NAME,
        BUTTON_CLASS_NAME,
        isPending && 'cursor-progress opacity-70',
      )}
    >
      {content}
    </button>
  )
}
