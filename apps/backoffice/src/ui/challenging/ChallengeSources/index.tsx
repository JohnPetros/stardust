import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { ChallengeSourcesPageView } from './ChallengeSourcesPageView'
import { useChallengeSourcesPage } from './useChallengeSourcesPage'

export const ChallengeSourcesPage = () => {
  const { challengingService } = useRestContext()
  const toastProvider = useToastProvider()
  const props = useChallengeSourcesPage({
    challengingService,
    toastProvider,
  })

  return <ChallengeSourcesPageView {...props} />
}
