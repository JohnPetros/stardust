import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { ChallengeInfoView } from './ChallengeInfoView'

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

  return (
    <ChallengeInfoView
      {...props}
      isAccountAuthenticated={false}
    />
  )
}
