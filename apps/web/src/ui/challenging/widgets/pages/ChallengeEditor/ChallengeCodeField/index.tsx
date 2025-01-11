import { Controller } from 'react-hook-form'

import { ChallengeField } from '../ChallengeField'
import { useChallengeCodeField } from './useChallengeCodeField'
import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'

export function ChallengeCodeField() {
  const { formControl, errorMessage } = useChallengeCodeField()

  return (
    <ChallengeField
      title='Código'
      subtitle='Código inicial disponível para os usuários. Não altere caso não seja necessário.'
      icon='code'
      hasError={Boolean(errorMessage)}
    >
      <Controller
        control={formControl}
        name='code'
        render={({ field: { value, onChange } }) => (
          <div>
            <CodeSnippet code={value} isRunnable={true} onChange={onChange} />
            {errorMessage && <ErrorMessage className='mt-1'>{errorMessage}</ErrorMessage>}
          </div>
        )}
      />
    </ChallengeField>
  )
}
