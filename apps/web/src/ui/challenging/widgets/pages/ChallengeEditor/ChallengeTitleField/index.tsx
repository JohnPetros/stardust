import { Input } from '@/ui/global/widgets/components/Input'
import { ChallengeField } from '../ChallengeField'
import { useChallengeTitleField } from './useChallengeTitleField'

export function ChallengeTitleField() {
  const { registerInput } = useChallengeTitleField()

  return (
    <ChallengeField title='Título' icon='title'>
      <Input
        type='text'
        placeholder='O problema dos 3 corpos'
        {...registerInput('title')}
      />
    </ChallengeField>
  )
}
