import { Controller } from 'react-hook-form'

import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'
import { ChallengeField } from '../ChallengeField'
import { useChallengeDescriptionField } from './useChallengeDescriptionField'
import { ContentEditor } from '../../../components/ContentEditor'

export function ChallengeDescriptionField() {
  const { formControl, errorMessage } = useChallengeDescriptionField()

  return (
    <ChallengeField
      title='Descrição'
      subtitle='Explique o problema do seu desafio, incluindo contexto, testes de casos e dicas de resolução, se possível'
      icon='description'
      hasError={Boolean(errorMessage)}
    >
      <Controller
        control={formControl}
        name='description'
        render={({ field: { value, onChange } }) => (
          <div>
            <ContentEditor content={value} onChange={onChange} />
            {errorMessage && <ErrorMessage className='mt-1'>{errorMessage}</ErrorMessage>}
          </div>
        )}
      />
    </ChallengeField>
  )
}
