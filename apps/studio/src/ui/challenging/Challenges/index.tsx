import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengesPageView } from './ChallengesPageView'
import { useChallengesPage } from './useChallengesPage'

export const ChallengesPage = () => {
  const { challengingService } = useRestContext()
  const props = useChallengesPage({ service: challengingService })

  return <ChallengesPageView {...props} />
}
