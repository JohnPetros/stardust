import ApolloAsking from '../../../../../../../public/lotties/apollo-asking.json'
import ApoloCrying from '../../../../../../../public/lotties/apollo-crying.json'
import ApoloDenying from '../../../../../../../public/lotties/apollo-denying.json'
import ApolloEarning from '../../../../../../../public/lotties/apollo-earning.json'
import ApolloMissing from '../../../../../../../public/lotties/apollo-missing.json'
import ApolloRidingRocket from '../../../../../../../public/lotties/apollo-riding-rocket.json'
import ApolloCongratulating from '../../../../../../../public/lotties/apollo-congratulating.json'
import ApolloGreeting from '../../../../../../../public/lotties/apollo-greeting.json'
import PlanetsExploration from '../../../../../../../public/lotties/planets-exploration.json'
import Trophy from '../../../../../../../public/lotties/trophy.json'
import Podium from '../../../../../../../public/lotties/podium.json'
import RocketCrossingSky from '../../../../../../../public/lotties/rocket-crossing-sky.json'
import RocketLaunching from '../../../../../../../public/lotties/rocket-launching.json'
import FastRocket from '../../../../../../../public/lotties/fast-rocket.json'
import PageNotFound from '../../../../../../../public/lotties/404.json'
import Galaxy from '../../../../../../../public/lotties/galaxy.json'
import RocketFloating from '../../../../../../../public/lotties/rocket-floating.json'
import RocketExploring from '../../../../../../../public/lotties/rocket-exploring.json'
import UnlockedStar from '../../../../../../../public/lotties/unlocked-star.json'
import Streak from '../../../../../../../public/lotties/streak.json'
import Spiral from '../../../../../../../public/lotties/spiral.json'
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
  'apollo-missing': ApolloMissing,
  'apollo-riding-rocket': ApolloRidingRocket,
  'rocket-lauching': RocketLaunching,
  'rocket-floating': RocketFloating,
  'rocket-crossing-sky': RocketCrossingSky,
  'rocket-exploring': RocketExploring,
  'apollo-congratulating': ApolloCongratulating,
  'apollo-greeting': ApolloGreeting,
  'unlocked-star': UnlockedStar,
  'planets-exploration': PlanetsExploration,
  'fast-rocket': FastRocket,
  galaxy: Galaxy,
  spiral: Spiral,
  podium: Podium,
  trophy: Trophy,
  shinning: Shinning,
  streak: Streak,
  space: Space,
  spinner: Spinner,
}
