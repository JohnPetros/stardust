import { Controller } from 'react-hook-form'

import { ChallengeField } from '../ChallengeField'
import { useChallengeCodeField } from './useChallengeCodeField'
import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'

export function ChallengeCodeField() {
  const { formControl } = useChallengeCodeField()

  return (
    <ChallengeField
      title='Código'
      subtitle='Código inicial disponível para os usuários. Não altere caso não seja necessário.'
      icon='code'
    >
      <Controller
        control={formControl}
        name='code'
        render={({ field: { value, onChange } }) => (
          <CodeSnippet code={value} isRunnable={true} onChange={onChange} />
        )}
      />
    </ChallengeField>
  )
}
