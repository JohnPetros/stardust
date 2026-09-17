import { ROUTES } from '@/constants'

import { ChallengesViewSwitchView } from './ChallengesViewSwitchView'

type Props = {
  activeView: 'roadmap' | 'catalog'
}

export function ChallengesViewSwitch({ activeView }: Props) {
  return (
    <ChallengesViewSwitchView
      activeView={activeView}
      roadmapHref={ROUTES.challenging.roadmap}
      catalogHref={ROUTES.challenging.challenges.list}
    />
  )
}
