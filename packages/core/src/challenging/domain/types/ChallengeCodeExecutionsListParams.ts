import type { Id, OrdinalNumber } from '#global/domain/structures/index'

export type ChallengeCodeExecutionsListParams = {
  userId: Id
  challengeId: Id
  page: OrdinalNumber
  itemsPerPage: OrdinalNumber
}
