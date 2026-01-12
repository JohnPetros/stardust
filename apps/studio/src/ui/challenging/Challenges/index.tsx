import { useRest } from '@/ui/global/hooks/useRest'
import { ChallengesPageView } from './ChallengesPageView'
import { useChallengesPage } from './useChallengesPage'

export const ChallengesPage = () => {
  const { challengingService } = useRest()
  const props = useChallengesPage({ service: challengingService })

  return <ChallengesPageView {...props} />
}
