import { Input } from '@/ui/global/widgets/components/Input'
import { ChallengeField } from '../ChallengeField'
import { useChallengeTitleField } from './useChallengeTitleField'

export function ChallengeTitleField() {
  const { errorMessage, registerInput } = useChallengeTitleField()

  return (
    <ChallengeField title='Título' icon='title' hasError={Boolean(errorMessage)}>
      <Input
        type='text'
        placeholder='O problema dos 3 corpos'
        errorMessage={errorMessage}
        {...registerInput('title')}
      />
    </ChallengeField>
  )
}
