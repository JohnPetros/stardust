import type { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { ChallengeContentNav } from '../../components/ChallengeContentNav'
import { ChallengeCodeExecutionCodeDialog } from './ChallengeCodeExecutionCodeDialog'
import { ChallengeCodeExecutionErrorDialog } from './ChallengeCodeExecutionErrorDialog'
import { ChallengeCodeExecutionItem } from './ChallengeCodeExecutionItem'

type Props = {
  executions: ChallengeCodeExecution[]
  selectedCodeExecution: ChallengeCodeExecution | null
  selectedErrorExecution: ChallengeCodeExecution | null
  page: number
  itemsPerPage: number
  totalItemsCount: number
  isLoading: boolean
  isFailure: boolean
  isAccountAuthenticated: boolean
  nextRoute: string
  onRetry: () => void
  onPageChange: (page: number) => void
  onSelectCodeExecution: (execution: ChallengeCodeExecution | null) => void
  onSelectErrorExecution: (execution: ChallengeCodeExecution | null) => void
  onUseExecutionCode: (execution: ChallengeCodeExecution) => void
}

export function ChallengeCodeExecutionsSlotView({
  executions,
  selectedCodeExecution,
  selectedErrorExecution,
  page,
  itemsPerPage,
  totalItemsCount,
  isLoading,
  isFailure,
  isAccountAuthenticated,
  nextRoute,
  onRetry,
  onPageChange,
  onSelectCodeExecution,
  onSelectErrorExecution,
  onUseExecutionCode,
}: Props) {
  return (
    <div className='h-full w-full overflow-y-auto bg-gray-800 px-6 py-4 text-gray-200'>
      <div className='md:hidden'>
        <ChallengeContentNav contents={['description', 'result', 'comments']} />
      </div>

      <header className='mt-5 flex items-end justify-between gap-4 border-gray-700/70 border-b pb-4 md:mt-0'>
        <div>
          <div className='flex items-center gap-2.5'>
            <span className='grid size-8 place-content-center rounded bg-green-900/70 text-green-400'>
              <Icon name='history' size={18} />
            </span>
            <h2 className='font-semibold text-gray-100 text-lg'>Execuções</h2>
          </div>
          <p className='mt-2 text-sm text-gray-400'>Histórico das suas tentativas</p>
        </div>

        {isAccountAuthenticated && !isLoading && !isFailure && totalItemsCount > 0 && (
          <span className='shrink-0 rounded bg-gray-900 px-2.5 py-1 text-gray-400 text-xs tabular-nums'>
            {totalItemsCount} {totalItemsCount === 1 ? 'execução' : 'execuções'}
          </span>
        )}
      </header>

      {!isAccountAuthenticated && (
        <div className='mx-auto flex max-w-sm flex-col items-center py-16 text-center'>
          <span className='grid size-11 place-content-center rounded-md bg-green-900/70 text-green-400'>
            <Icon name='lock' size={19} />
          </span>
          <h3 className='mt-4 font-semibold text-gray-100'>Entre para continuar</h3>
          <p className='mt-2 text-sm text-gray-400'>
            Faça login para acessar o histórico das suas execuções neste desafio.
          </p>
          <Button asChild className='mt-5 h-9 w-full max-w-60 gap-2 text-green-900'>
            <Link
              href={{
                pathname: ROUTES.auth.signIn,
                query: { nextRoute },
              }}
            >
              Fazer login
              <Icon name='arrow-right' size={15} />
            </Link>
          </Button>
        </div>
      )}

      {isAccountAuthenticated && isLoading && (
        <div className='flex justify-center py-12'>
          <Loading />
        </div>
      )}

      {isAccountAuthenticated && isFailure && !isLoading && (
        <div className='mx-auto flex max-w-sm flex-col items-center py-16 text-center'>
          <span className='grid size-11 place-content-center rounded-md bg-red-950/40 text-red-400'>
            <Icon name='alert' size={20} />
          </span>
          <p className='mt-4 text-gray-400'>Não foi possível carregar suas execuções.</p>
          <Button className='mt-4 h-9 px-4' onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      )}

      {isAccountAuthenticated && !isLoading && !isFailure && executions.length === 0 && (
        <div className='flex flex-col items-center py-16 text-center'>
          <span className='grid size-11 place-content-center rounded-md bg-gray-900 text-gray-500'>
            <Icon name='terminal' size={20} />
          </span>
          <p className='mt-4 text-sm text-gray-400'>Nenhuma execução encontrada.</p>
        </div>
      )}

      {isAccountAuthenticated && !isFailure && executions.length > 0 && (
        <>
          <ul className='mt-5 space-y-3'>
            {executions.map((execution) => (
              <ChallengeCodeExecutionItem
                key={`${execution.createdAt.toISOString()}-${execution.status.value}`}
                execution={execution}
                onShowCode={onSelectCodeExecution}
                onShowError={onSelectErrorExecution}
              />
            ))}
          </ul>

          <div className='mt-6'>
            <Pagination
              page={page}
              itemsPerPage={itemsPerPage}
              totalItemsCount={totalItemsCount}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}

      <ChallengeCodeExecutionCodeDialog
        execution={selectedCodeExecution}
        onOpenChange={(isOpen) => {
          if (!isOpen) onSelectCodeExecution(null)
        }}
        onUseCode={onUseExecutionCode}
      />
      <ChallengeCodeExecutionErrorDialog
        execution={selectedErrorExecution}
        onOpenChange={(isOpen) => {
          if (!isOpen) onSelectErrorExecution(null)
        }}
      />
    </div>
  )
}
