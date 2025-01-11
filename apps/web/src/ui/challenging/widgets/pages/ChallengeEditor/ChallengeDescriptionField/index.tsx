import { Controller } from 'react-hook-form'

import { ContentEditor } from '../../../components/ContentEditor'
import { ChallengeField } from '../ChallengeField'
import { useChallengeDescriptionField } from './useChallengeDescriptionField'

export function ChallengeDescriptionField() {
  const { formControl } = useChallengeDescriptionField()

  return (
    <ChallengeField
      title='Descrição'
      subtitle='Explique o problema do seu desafio, incluindo contexto, testes de casos e dicas de resolução, se possível'
      icon='description'
    >
      <Controller
        control={formControl}
        name='description'
        render={({ field: { value, onChange } }) => (
          <ContentEditor content={value} onChange={onChange} />
        )}
      />
    </ChallengeField>
  )
}
