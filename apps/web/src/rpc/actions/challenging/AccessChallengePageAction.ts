import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import { Challenge } from '@stardust/core/challenging/entities'
import { ChallengeVote } from '@stardust/core/challenging/structures'
import { Star } from '@stardust/core/space/entities'
import { User } from '@stardust/core/global/entities'
import { Slug, type Id } from '@stardust/core/global/structures'

import { getCurrentGalaxyTrail } from '../space/getCurrentGalaxyTrail'

type Dependencies = {
  challengingService: ChallengingService
  spaceService: SpaceService
  isAuthenticated: boolean
}

type Request = {
  challengeSlug: string
}

type Response = {
  challengeDto: ChallengeDto
  userChallengeVote: string
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
}

const EMPTY_NAVIGATION = {
  previousChallengeSlug: null,
  nextChallengeSlug: null,
}

async function isStarInaccessible(spaceService: SpaceService, user: User, starId: Id) {
  const response = await spaceService.fetchStarById(starId)
  if (response.isFailure) return false

  const star = Star.create(response.body)
  if (user.isGod.isTrue) return false

  const trail = await getCurrentGalaxyTrail(spaceService, user)
  return !trail || trail.canAccessStar(star.id).isFalse
}

async function fetchUserChallengeVote(
  challengingService: ChallengingService,
  challengeId: Id,
) {
  const response = await challengingService.fetchChallengeVote(challengeId)
  if (response.isFailure) response.throwError()
  return ChallengeVote.create(response.body.challengeVote)
}

async function fetchChallenge(challengingService: ChallengingService, slug: string) {
  const response = await challengingService.fetchChallengeBySlug(Slug.create(slug))
  if (response.isFailure) response.throwError()
  return Challenge.create(response.body)
}

async function fetchChallengeNavigation(
  challengingService: ChallengingService,
  slug: string,
) {
  const response = await challengingService.fetchChallengeNavigation(Slug.create(slug))
  if (response.isFailure) response.throwError()
  return response.body
}

function buildResponse(
  challenge: Challenge,
  userChallengeVote: string,
  navigation: Pick<Response, 'previousChallengeSlug' | 'nextChallengeSlug'>,
): Response {
  return {
    challengeDto: challenge.dto,
    userChallengeVote,
    previousChallengeSlug: navigation.previousChallengeSlug,
    nextChallengeSlug: navigation.nextChallengeSlug,
  }
}

async function accessAsVisitor(
  call: Call<Request>,
  challengingService: ChallengingService,
  challenge: Challenge,
  challengeSlug: string,
) {
  if (challenge.starId || challenge.isPublic.isFalse) {
    call.notFound()
  }

  const navigation = await fetchChallengeNavigation(challengingService, challengeSlug)
  return buildResponse(challenge, ChallengeVote.createAsNone().value, navigation)
}

async function assertStarAccessible(
  call: Call<Request>,
  spaceService: SpaceService,
  challenge: Challenge,
  user: User,
) {
  if (
    challenge.starId &&
    (await isStarInaccessible(spaceService, user, challenge.starId))
  ) {
    call.notFound()
  }
}

function assertChallengeVisible(call: Call<Request>, challenge: Challenge, user: User) {
  const isAuthor = challenge.isChallengeAuthor(user.id)
  if (challenge.isPublic.isFalse && isAuthor.isFalse && user.isGod.isFalse) {
    call.notFound()
  }
}

async function accessAsUser(
  call: Call<Request>,
  { challengingService, spaceService }: Omit<Dependencies, 'isAuthenticated'>,
  challenge: Challenge,
  challengeSlug: string,
  user: User,
) {
  await assertStarAccessible(call, spaceService, challenge, user)

  const navigation = challenge.starId
    ? EMPTY_NAVIGATION
    : await fetchChallengeNavigation(challengingService, challengeSlug)

  assertChallengeVisible(call, challenge, user)

  const userChallengeVote = await fetchUserChallengeVote(challengingService, challenge.id)
  return buildResponse(challenge, userChallengeVote.value, navigation)
}

export const AccessChallengePageAction = ({
  challengingService,
  spaceService,
  isAuthenticated,
}: Dependencies): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { challengeSlug } = call.getRequest()
      const challenge = await fetchChallenge(challengingService, challengeSlug)

      if (!isAuthenticated) {
        return accessAsVisitor(call, challengingService, challenge, challengeSlug)
      }

      const user = User.create(await call.getUser())
      return accessAsUser(
        call,
        { challengingService, spaceService },
        challenge,
        challengeSlug,
        user,
      )
    },
  }
}
