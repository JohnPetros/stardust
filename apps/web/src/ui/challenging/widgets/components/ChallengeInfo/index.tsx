import { ChallengeInfoView } from './ChallengeInfoView'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

type ChallengeInfo = {
  isCompleted: boolean
  downvotes: number
  upvotes: number
  completionsCount: number
  authorName: string
  authorSlug: string
}

export const ChallengeInfo = (props: ChallengeInfo) => {
  const { account } = useAuthContext()

  if (account)
    return (
      <ChallengeInfoView
        {...props}
        isAccountAuthenticated={account.isAuthenticated.isTrue}
      />
    )
}
