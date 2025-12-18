import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { ChallengesTableView } from '@/ui/global/widgets/components/ChallengesTable'

type Props = {
  challenges: ChallengeDto[]
  isLoading: boolean
}

export const RecentChallengesTableView = ({ challenges, isLoading }: Props) => {
  return <ChallengesTableView challenges={challenges} isLoading={isLoading} />
}
