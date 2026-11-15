import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { Button } from '@/ui/global/widgets/components/Button'

import { GalaxiesLoadFailure } from './GalaxiesLoadFailure'
import { GalaxiesLoading } from './GalaxiesLoading'
import { GalaxiesMap } from './GalaxiesMap'

export type Props = {
  backLabel: string
  galaxies: GalaxySummaryDto[]
  isLoading: boolean
  hasError: boolean
  pendingGalaxySlug: string | null
  onBack: () => void
  onRetry: () => void
  onEnter: (galaxy: GalaxySummaryDto) => void
}

type ContentProps = Pick<
  Props,
  'galaxies' | 'isLoading' | 'hasError' | 'pendingGalaxySlug' | 'onRetry' | 'onEnter'
>

function GalaxiesContent({
  galaxies,
  isLoading,
  hasError,
  pendingGalaxySlug,
  onRetry,
  onEnter,
}: ContentProps) {
  if (isLoading) return <GalaxiesLoading />

  if (hasError) return <GalaxiesLoadFailure onRetry={onRetry} />

  return (
    <>
      <p className='mt-[8px] max-w-[520px] text-[14px] leading-[1.5] text-theme-text-secondary lg:mx-auto lg:text-center'>
        Cada galáxia é um curso. Escolha em qual você quer estudar.
      </p>
      <GalaxiesMap
        galaxies={galaxies}
        pendingGalaxySlug={pendingGalaxySlug}
        onEnter={onEnter}
      />
    </>
  )
}

export function GalaxiesPageView({
  backLabel,
  galaxies,
  isLoading,
  hasError,
  pendingGalaxySlug,
  onBack,
  onRetry,
  onEnter,
}: Props) {
  return (
    <div className='relative'>
      <section className='relative z-10 flex flex-col max-md:px-[24px] pb-[40px] pt-[24px] md:pl-[136px] md:pr-[48px] md:pt-8 lg:pl-[160px]'>
        <Button
          testId='back-button'
          onClick={onBack}
          className='w-fit border border-theme-border bg-transparent px-6 text-theme-text-primary hover:bg-theme-surface hover:brightness-100'
        >
          {backLabel}
        </Button>

        <h1 className='mt-[16px] text-[24px] font-semibold leading-[1.2] text-theme-text-primary md:mt-6 md:text-[28px] md:leading-[1.3636] lg:text-center'>
          Galáxias
        </h1>

        <GalaxiesContent
          galaxies={galaxies}
          isLoading={isLoading}
          hasError={hasError}
          pendingGalaxySlug={pendingGalaxySlug}
          onRetry={onRetry}
          onEnter={onEnter}
        />
      </section>
    </div>
  )
}
