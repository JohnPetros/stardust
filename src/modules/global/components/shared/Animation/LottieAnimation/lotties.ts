import ApolloAsking from '../../../../../../../public/lotties/apollo-asking.json'
import ApoloCrying from '../../../../../../../public/lotties/apollo-crying.json'
import ApoloDenying from '../../../../../../../public/lotties/apollo-denying.json'
import ApolloEarning from '../../../../../../../public/lotties/apollo-earning.json'
import ApolloRidingRocket from '../../../../../../../public/lotties/apollo-riding-rocket.json'
import RocketLaunching from '../../../../../../../public/lotties/rocket-launching.json'
import PageNotFound from '../../../../../../../public/lotties/404.json'
import RocketFloating from '../../../../../../../public/lotties/rocket-floating.json'
import RocketExploring from '../../../../../../../public/lotties/rocket-exploring.json'
import UnlockedStar from '../../../../../../../public/lotties/unlocked-star.json'
import Streak from '../../../../../../../public/lotties/streak.json'
import Space from '../../../../../../../public/lotties/space.json'
import Spinner from '../../../../../../../public/lotties/spinner.json'
import Shinning from '../../../../../../../public/lotties/reward-shinning.json'

import type { AnimationName } from '../types'

export const LOTTIES: Record<AnimationName, unknown> = {
  '404': PageNotFound,
  'apollo-crying': ApoloCrying,
  'apollo-asking': ApolloAsking,
  'apollo-denying': ApoloDenying,
  'apollo-earning': ApolloEarning,
  'apollo-riding-rocket': ApolloRidingRocket,
  'rocket-lauching': RocketLaunching,
  'rocket-floating': RocketFloating,
  'rocket-exploring': RocketExploring,
  'unlocked-star': UnlockedStar,
  shinning: Shinning,
  streak: Streak,
  space: Space,
  spinner: Spinner,
}
