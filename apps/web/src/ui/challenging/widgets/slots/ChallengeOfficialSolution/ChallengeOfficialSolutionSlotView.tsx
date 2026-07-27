import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'
import Link from 'next/link'

import { ROUTES } from '@/constants'
import { CodePlayback } from '@/ui/global/widgets/components/CodePlayback'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  challengeSlug: string
  officialSolution: CodePlaybackDto | null
}

export function ChallengeOfficialSolutionSlotView({
  challengeSlug,
  officialSolution,
}: Props) {
  return (
    <div className='px-6 py-3'>
      <header className='mb-6'>
        <Link
          href={ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug)}
          className='inline-flex items-center text-sm text-green-400 custom-outline rounded'
        >
          <Icon name='simple-arrow-left' size={14} className='mr-1' />
          Ver todas as soluções
        </Link>
        <h1 className='mt-3 text-lg text-gray-50'>Solução oficial</h1>
      </header>

      {officialSolution ? (
        <CodePlayback playback={officialSolution} />
      ) : (
        <section
          aria-labelledby='official-solution-empty-title'
          data-testid='official-solution-empty'
          className='rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-100'
        >
          <h2 id='official-solution-empty-title' className='text-base font-semibold'>
            Solução oficial indisponível
          </h2>
          <p className='mt-2 text-sm text-gray-300'>
            Este desafio ainda não possui uma solução oficial publicada.
          </p>
        </section>
      )}
    </div>
  )
}
