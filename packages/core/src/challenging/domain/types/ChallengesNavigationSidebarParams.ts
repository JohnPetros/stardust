import type { ChallengeDifficultyLevel } from './ChallengeDifficultyLevel'
import type { ChallengeCompletionStatusValue } from './ChallengeCompletionStatusValue'
import type { IdsList, OrdinalNumber, Text } from '#global/domain/structures/index'

export type ChallengesNavigationSidebarParams = {
  page: OrdinalNumber
  itemsPerPage: OrdinalNumber
  title: Text
  difficultyLevels: ChallengeDifficultyLevel[]
  categoriesIds: IdsList
  completionStatus: 'all' | ChallengeCompletionStatusValue
}
