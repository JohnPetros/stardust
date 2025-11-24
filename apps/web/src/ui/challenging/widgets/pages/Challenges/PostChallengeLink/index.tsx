'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { PostChallengeLinkView } from './PostChallengeLinkView'

export const PostChallengeLink = () => {
  const { user } = useAuthContext()
  if (user?.hasEngineerRole.isTrue) return <PostChallengeLinkView />
}
