import type { ChallengeRoadmapDto } from '@stardust/core/challenging/structures/dtos'

type Props = {
  progress: ChallengeRoadmapDto['progress']
  recommendation: ChallengeRoadmapDto['recommendation']
  isAuthenticated: boolean
  onContinue: () => void
}

export function RoadmapProgressSummaryView({
  progress,
  recommendation,
  isAuthenticated,
  onContinue,
}: Props) {
  const hasPersonalProgress = isAuthenticated && progress !== null
  return (
    <aside
      className='rounded-lg border border-gray-700 bg-gray-900 p-5'
      aria-label='Seu progresso'
    >
      <div className='flex items-end justify-between gap-3'>
        <div>
          <p className='text-sm text-gray-400'>Progresso da trilha</p>
          {hasPersonalProgress ? (
            <p className='mt-1 text-3xl font-bold text-green-400'>
              {progress.percentage}%
            </p>
          ) : (
            <p className='mt-1 text-sm text-gray-400'>Progresso pessoal indisponível</p>
          )}
        </div>
        {hasPersonalProgress ? (
          <p className='text-right text-xs text-gray-400'>
            <strong className='block text-gray-100'>
              {progress.completed} de {progress.total}
            </strong>
            desafios concluídos
          </p>
        ) : null}
      </div>
      {hasPersonalProgress ? (
        <div
          role='progressbar'
          className='mt-4 h-2 overflow-hidden rounded-full bg-gray-700'
          aria-label={`${progress.percentage}% concluído`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.percentage}
        >
          <div
            className='h-full rounded-full bg-green-400 transition-all'
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      ) : null}
      {!isAuthenticated ? (
        <p className='mt-4 text-sm text-gray-300'>
          Entre para acompanhar seu progresso e receber recomendações.
        </p>
      ) : recommendation ? (
        <div className='mt-4 border-t border-gray-700 pt-4'>
          <p className='text-xs uppercase tracking-wide text-gray-400'>Próximo desafio</p>
          <p className='mt-1 truncate text-sm text-gray-100'>
            {recommendation.challengeSlug}
          </p>
          <button
            type='button'
            onClick={onContinue}
            className='mt-3 min-h-11 w-full rounded bg-green-400 px-4 py-2 text-sm font-semibold text-gray-950 hover:brightness-90'
          >
            Continuar próximo desafio
          </button>
        </div>
      ) : (
        <p className='mt-4 rounded border border-green-700/50 bg-green-950/30 p-3 text-sm text-green-300'>
          Trilha concluída. Excelente trabalho!
        </p>
      )}
    </aside>
  )
}
