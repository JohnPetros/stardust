import type { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import * as Dialog from '@/ui/global/widgets/components/Dialog'

type Props = {
  execution: ChallengeCodeExecution | null
  onOpenChange: (isOpen: boolean) => void
}

export function ChallengeCodeExecutionErrorDialog({ execution, onOpenChange }: Props) {
  const error = execution?.error

  return (
    <Dialog.Container open={Boolean(execution)} onOpenChange={onOpenChange}>
      <Dialog.Content className='max-w-xl bg-gray-900 text-gray-100'>
        <Dialog.Header>Erro da execução</Dialog.Header>
        {execution && error && (
          <div className='space-y-3 text-sm'>
            {error.line !== null && (
              <p>
                <span className='text-gray-400'>Linha: </span>
                {error.line.value}
              </p>
            )}
            <p className='rounded bg-gray-950 p-3 text-gray-200'>{error.message.value}</p>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Container>
  )
}
