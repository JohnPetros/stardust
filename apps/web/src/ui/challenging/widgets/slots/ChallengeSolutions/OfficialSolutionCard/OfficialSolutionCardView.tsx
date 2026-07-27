import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  challengeSlug: string
}

export function OfficialSolutionCardView({ challengeSlug }: Props) {
  return (
    <article
      aria-labelledby='official-solution-card-title'
      data-testid='official-solution-card'
      className='w-full rounded-md border border-green-500/60 bg-gray-800 p-4 transition-colors hover:border-green-400'
    >
      <Link
        href={ROUTES.challenging.challenges.challengeSolutions.official(challengeSlug)}
        aria-label='Abrir solução oficial do desafio'
        className='flex items-center gap-3 custom-outline rounded-md'
      >
        <span
          aria-hidden='true'
          className='flex size-10 shrink-0 items-center justify-center rounded-full bg-green-400 text-gray-950'
        >
          <Icon name='code' size={20} weight='bold' />
        </span>
        <span>
          <span className='block text-xs font-semibold uppercase tracking-wide text-green-300'>
            Solução oficial da plataforma
          </span>
          <span
            id='official-solution-card-title'
            className='mt-1 block text-base font-semibold text-gray-50'
          >
            Ver a solução oficial
          </span>
          <span className='mt-1 block text-sm text-gray-300'>
            Acompanhe a execução passo a passo no Code Playback.
          </span>
        </span>
      </Link>
    </article>
  )
}
