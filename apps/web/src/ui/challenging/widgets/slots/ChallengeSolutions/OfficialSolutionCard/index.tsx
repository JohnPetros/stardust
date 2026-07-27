import { OfficialSolutionCardView } from './OfficialSolutionCardView'

type Props = {
  challengeSlug: string
}

export function OfficialSolutionCard({ challengeSlug }: Props) {
  return <OfficialSolutionCardView challengeSlug={challengeSlug} />
}
