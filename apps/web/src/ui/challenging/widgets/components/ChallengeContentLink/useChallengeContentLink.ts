import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'

type Params = {
  contentType: ChallengeContent
}

export function useChallengeContentLink({ contentType }: Params) {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

  const href = `${ROUTES.challenging.challenges.challenge(challenge?.slug.value ?? '')}${
    contentType !== 'description' ? `/${contentType}` : ''
  }`

  return {
    href,
  }
}
