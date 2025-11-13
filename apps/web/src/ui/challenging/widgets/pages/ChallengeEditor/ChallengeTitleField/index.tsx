import { Input } from '@/ui/global/widgets/components/Input'
import { useRest } from '@/ui/global/hooks/useRest'
import { ChallengeField } from '../ChallengeField'
import { useChallengeTitleField } from './useChallengeTitleField'

export function ChallengeTitleField() {
  const { challengingService } = useRest()
  const { errorMessage, registerInput } = useChallengeTitleField(challengingService)

  return (
    <ChallengeField
      title='Título'
      icon='title'
      subtitle='Escreva um título que tenha a ver com problema mas que seja chamativo'
      hasError={Boolean(errorMessage)}
    >
      <Input
        type='text'
        placeholder='Ex.: O problema dos 3 corpos'
        errorMessage={errorMessage}
        {...registerInput('title')}
      />
    </ChallengeField>
  )
}
