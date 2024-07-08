import ApolloAsking from '../../../../../../../public/lotties/apollo-asking.json'
import ApoloCrying from '../../../../../../../public/lotties/apollo-crying.json'
import ApoloDenying from '../../../../../../../public/lotties/apollo-denying.json'
import ApolloEarning from '../../../../../../../public/lotties/apollo-earning.json'
import ApolloRidingRocket from '../../../../../../../public/lotties/apollo-riding-rocket.json'
import RocketLaunching from '../../../../../../../public/lotties/apollo-riding-rocket.json'
import PageNotFound from '../../../../../../../public/lotties/404.json'
import RocketFloating from '../../../../../../../public/lotties/rocket-floating.json'
import Spinner from '../../../../../../../public/lotties/spinner.json'

import type { AnimationName } from '../types'

export const LOTTIES: Record<AnimationName, unknown> = {
  'apollo-crying': ApoloCrying,
  'apollo-asking': ApolloAsking,
  'apollo-denying': ApoloDenying,
  'apollo-earning': ApolloEarning,
  'apollo-riding-rocket': ApolloRidingRocket,
  'rocket-lauching': RocketLaunching,
  'rocket-floating': RocketFloating,
  '404': PageNotFound,
  spinner: Spinner,
}
