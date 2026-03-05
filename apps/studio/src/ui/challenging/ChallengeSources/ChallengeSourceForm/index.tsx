import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengeSourceFormView } from './ChallengeSourceFormView'

type Props = {
  onSubmit: (url: string, challengeId: string) => Promise<string | null>
}

export const ChallengeSourceForm = ({ onSubmit }: Props) => {
  const { challengingService } = useRestContext()

  return (
    <ChallengeSourceFormView
      challengingService={challengingService}
      onSubmit={onSubmit}
    />
  )
}
