import { Datetime } from '@stardust/core/global/libs'
import type { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import { twMerge } from 'tailwind-merge'

import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  execution: ChallengeCodeExecution
  onShowCode: (execution: ChallengeCodeExecution) => void
  onShowError: (execution: ChallengeCodeExecution) => void
}

const STATUS_DETAILS = {
  accepted: {
    label: 'Aceita',
    icon: 'check',
    accentClassName: 'bg-green-400',
    badgeClassName: 'border-green-500/30 bg-green-900/50 text-green-300',
    progressClassName: 'bg-green-400',
  },
  wrong_answer: {
    label: 'Resposta incorreta',
    icon: 'close',
    accentClassName: 'bg-red-600',
    badgeClassName: 'border-red-500/30 bg-red-950/40 text-red-300',
    progressClassName: 'bg-red-500',
  },
  syntax_error: {
    label: 'Erro de sintaxe',
    icon: 'code',
    accentClassName: 'bg-yellow-500',
    badgeClassName: 'border-yellow-500/30 bg-yellow-950/30 text-yellow-300',
    progressClassName: 'bg-yellow-500',
  },
  runtime_error: {
    label: 'Erro em execução',
    icon: 'bug',
    accentClassName: 'bg-orange-500',
    badgeClassName: 'border-orange-500/30 bg-orange-950/30 text-orange-300',
    progressClassName: 'bg-orange-500',
  },
  internal_error: {
    label: 'Erro interno',
    icon: 'alert',
    accentClassName: 'bg-gray-500',
    badgeClassName: 'border-gray-500/30 bg-gray-800 text-gray-300',
    progressClassName: 'bg-gray-500',
  },
} as const

export function ChallengeCodeExecutionItem({
  execution,
  onShowCode,
  onShowError,
}: Props) {
  const status = STATUS_DETAILS[execution.status.value]
  const passedTestsCount = execution.passedTestsCount.value
  const totalTestsCount = execution.testResults.length
  const progressPercentage =
    totalTestsCount > 0 ? Math.round((passedTestsCount / totalTestsCount) * 100) : 0
  const dateTime = execution.createdAt.toISOString()

  return (
    <li className='group relative overflow-hidden rounded-md border border-gray-700/80 bg-gray-900 transition-colors hover:border-gray-600'>
      <span
        aria-hidden='true'
        className={twMerge('absolute inset-y-0 left-0 w-1', status.accentClassName)}
      />

      <div className='flex flex-col gap-5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8'>
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
            <span
              className={twMerge(
                'inline-flex h-7 items-center gap-1.5 rounded border px-2.5 text-xs font-semibold',
                status.badgeClassName,
              )}
            >
              <Icon name={status.icon} size={14} weight='bold' />
              {status.label}
            </span>

            <time
              dateTime={dateTime}
              className='inline-flex items-center gap-1.5 text-xs text-gray-400'
            >
              <Icon name='clock' size={14} />
              {new Datetime(execution.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </time>
          </div>

          <div className='mt-4 max-w-md'>
            {totalTestsCount > 0 ? (
              <>
                <div className='mb-2 flex items-center justify-between gap-4 text-xs'>
                  <span className='font-medium text-gray-300'>Testes aprovados</span>
                  <span className='tabular-nums text-gray-400'>
                    <strong className='font-semibold text-gray-100'>
                      {passedTestsCount}
                    </strong>
                    <span aria-hidden='true'> / </span>
                    <span className='sr-only'> de </span>
                    {totalTestsCount}
                  </span>
                </div>
                <div
                  role='progressbar'
                  aria-label='Testes aprovados'
                  aria-valuemin={0}
                  aria-valuemax={totalTestsCount}
                  aria-valuenow={passedTestsCount}
                  className='h-1.5 overflow-hidden rounded-full bg-gray-700'
                >
                  <span
                    className={twMerge(
                      'block h-full rounded-full transition-[width] duration-500',
                      status.progressClassName,
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </>
            ) : (
              <span className='text-gray-500 text-xs'>Nenhum teste concluído</span>
            )}
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Button
            className='h-9 w-max gap-2 border border-gray-600 bg-gray-800 px-3.5 text-xs text-gray-100 hover:border-gray-500 hover:bg-gray-700 hover:brightness-100'
            onClick={() => onShowCode(execution)}
          >
            <Icon name='code' size={15} />
            Ver código
          </Button>
          {execution.error && (
            <Button
              className='h-9 w-max gap-2 border border-red-500/30 bg-red-950/40 px-3.5 text-xs text-red-200 hover:bg-red-900/50 hover:brightness-100'
              onClick={() => onShowError(execution)}
            >
              <Icon name='bug' size={15} />
              Ver erro
            </Button>
          )}
        </div>
      </div>
    </li>
  )
}
