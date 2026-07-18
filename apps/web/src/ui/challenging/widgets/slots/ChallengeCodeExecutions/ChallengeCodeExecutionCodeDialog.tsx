import type { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import { Button } from '@/ui/global/widgets/components/Button'
import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'
import * as Dialog from '@/ui/global/widgets/components/Dialog'

type Props = {
  execution: ChallengeCodeExecution | null
  onOpenChange: (isOpen: boolean) => void
  onUseCode: (execution: ChallengeCodeExecution) => void
}

export function ChallengeCodeExecutionCodeDialog({
  execution,
  onOpenChange,
  onUseCode,
}: Props) {
  return (
    <Dialog.Container open={Boolean(execution)} onOpenChange={onOpenChange}>
      <Dialog.Content className='max-w-3xl bg-gray-900 text-gray-100'>
        <Dialog.Header>Código da execução</Dialog.Header>
        {execution && (
          <div className='space-y-4'>
            <CodeSnippet code={execution.code.value} />
            <Button
              className='ml-auto h-9 w-max px-4 text-green-900'
              onClick={() => onUseCode(execution)}
            >
              Usar no editor
            </Button>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Container>
  )
}
