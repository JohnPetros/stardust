import type { ChallengeDto } from '#dtos'
import { _unlockDoc } from './_unlockDoc'
import { ChallengeHeader } from './ChallengeHeader'

type ChallengePageProps = {
  challengeDto: ChallengeDto
}

export async function ChallengePage({ challengeDto }: ChallengePageProps) {
  await _unlockDoc(challengeDto)

  return <ChallengeHeader challengeDto={challengeDto} />
}
