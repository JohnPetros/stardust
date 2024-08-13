import type { ChallengeDTO } from '@/@core/dtos'
import { _unlockDoc } from './_unlockDoc'
import { ChallengeHeader } from './ChallengeHeader'

type ChallengePageProps = {
  challengeDTO: ChallengeDTO
}

export async function ChallengePage({ challengeDTO }: ChallengePageProps) {
  await _unlockDoc(challengeDTO)

  return <ChallengeHeader challengeDTO={challengeDTO} />
}
