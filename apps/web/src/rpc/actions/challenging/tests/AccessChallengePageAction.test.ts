import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { Challenge } from '@stardust/core/challenging/entities'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { ChallengeVote } from '@stardust/core/challenging/structures'
import { ChallengeNavigationFaker } from '@stardust/core/challenging/structures/fakers'
import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Slug } from '@stardust/core/global/structures'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { SpaceService } from '@stardust/core/space/interfaces'
import { StarsFaker } from '@stardust/core/space/entities/fakers'

import { AccessChallengePageAction } from '../AccessChallengePageAction'

describe('Access Challenge Page Action', () => {
  let call: Mock<Call<{ challengeSlug: string }>>
  let challengingService: Mock<ChallengingService>
  let spaceService: Mock<SpaceService>

  const challengeSlug = 'binary-search'

  function makeAction(isAuthenticated = false) {
    return AccessChallengePageAction({
      challengingService,
      spaceService,
      isAuthenticated,
    })
  }

  beforeEach(() => {
    call = mock<Call<{ challengeSlug: string }>>()
    challengingService = mock<ChallengingService>()
    spaceService = mock<SpaceService>()

    call.getRequest.mockReturnValue({ challengeSlug })
    call.notFound.mockImplementation(() => {
      throw new Error('Not found')
    })
  })

  it('should return the navigation payload for unauthenticated public access without star', async () => {
    const postedAt = new Date('2026-03-20T00:00:00.000Z')
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: true,
      postedAt,
      starId: undefined,
    })
    const navigationDto = ChallengeNavigationFaker.fakeDto({
      previousChallengeSlug: 'arrays',
      nextChallengeSlug: 'linked-lists',
    })
    const expectedChallengeDto = Challenge.create(challengeDto).dto

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchChallengeNavigation.mockResolvedValue(
      new RestResponse({ body: navigationDto }),
    )

    const response = await makeAction().handle(call)

    expect(challengingService.fetchChallengeBySlug).toHaveBeenCalledWith(
      Slug.create(challengeSlug),
    )
    expect(challengingService.fetchChallengeNavigation).toHaveBeenCalledWith(
      Slug.create(challengeSlug),
    )
    expect(response).toEqual({
      challengeDto: expectedChallengeDto,
      userChallengeVote: ChallengeVote.createAsNone().value,
      previousChallengeSlug: navigationDto.previousChallengeSlug,
      nextChallengeSlug: navigationDto.nextChallengeSlug,
    })
    expect(call.notFound).not.toHaveBeenCalled()
    expect(challengingService.fetchChallengeVote).not.toHaveBeenCalled()
    expect(call.getUser).not.toHaveBeenCalled()
  })

  it('should return the user vote and navigation payload for authenticated access', async () => {
    const userDto = UsersFaker.fakeDto()
    const authorEntity = ChallengesFaker.fakeDto().author.entity
    const postedAt = new Date('2026-03-20T00:00:00.000Z')
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: true,
      postedAt,
      author: {
        id: userDto.id as string,
        entity: authorEntity,
      },
    })
    const navigationDto = ChallengeNavigationFaker.fakeDto({
      previousChallengeSlug: 'arrays',
      nextChallengeSlug: 'linked-lists',
    })
    const expectedChallengeDto = Challenge.create(challengeDto).dto

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchChallengeNavigation.mockResolvedValue(
      new RestResponse({ body: navigationDto }),
    )
    challengingService.fetchChallengeVote.mockResolvedValue(
      new RestResponse({ body: { challengeVote: 'upvote' } }),
    )
    call.getUser.mockResolvedValue(userDto)

    const response = await makeAction(true).handle(call)

    expect(call.getUser).toHaveBeenCalled()
    expect(challengingService.fetchChallengeVote).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeDto.id }),
    )
    expect(response).toEqual({
      challengeDto: expectedChallengeDto,
      userChallengeVote: 'upvote',
      previousChallengeSlug: navigationDto.previousChallengeSlug,
      nextChallengeSlug: navigationDto.nextChallengeSlug,
    })
  })

  it('should stop before fetching navigation when challenge access fails', async () => {
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Challenge not found' }),
    )

    await expect(makeAction().handle(call)).rejects.toThrow('Challenge not found')

    expect(challengingService.fetchChallengeNavigation).not.toHaveBeenCalled()
    expect(call.getUser).not.toHaveBeenCalled()
  })

  it('should throw when the navigation lookup fails', async () => {
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug, isPublic: true })
    call.getUser.mockResolvedValue(UsersFaker.fakeDto())

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchChallengeNavigation.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Navigation failed' }),
    )

    await expect(makeAction(true).handle(call)).rejects.toThrow('Navigation failed')

    expect(call.getUser).toHaveBeenCalled()
    expect(challengingService.fetchChallengeVote).not.toHaveBeenCalled()
  })

  it('should call notFound for unauthenticated users on star challenges', async () => {
    const starDto = StarsFaker.fakeDto()
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: true,
      starId: starDto.id,
    })

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    spaceService.fetchStarById.mockResolvedValue(new RestResponse({ body: starDto }))

    await expect(makeAction().handle(call)).rejects.toThrow('Not found')

    expect(spaceService.fetchStarById).not.toHaveBeenCalled()
    expect(call.notFound).toHaveBeenCalled()
    expect(challengingService.fetchChallengeNavigation).not.toHaveBeenCalled()
    expect(challengingService.fetchChallengeVote).not.toHaveBeenCalled()
  })

  it('should call notFound for unauthenticated users on private challenges', async () => {
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: false,
      starId: undefined,
    })

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )

    await expect(makeAction().handle(call)).rejects.toThrow('Not found')

    expect(call.notFound).toHaveBeenCalled()
    expect(challengingService.fetchChallengeNavigation).not.toHaveBeenCalled()
    expect(challengingService.fetchChallengeVote).not.toHaveBeenCalled()
    expect(call.getUser).not.toHaveBeenCalled()
  })

  it('should call notFound when the authenticated user has not unlocked the star', async () => {
    const starDto = StarsFaker.fakeDto()
    const userDto = UsersFaker.fakeDto({ unlockedStarsIds: [] })
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: true,
      starId: starDto.id,
    })

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    spaceService.fetchStarById.mockResolvedValue(new RestResponse({ body: starDto }))
    call.getUser.mockResolvedValue(userDto)

    await expect(makeAction(true).handle(call)).rejects.toThrow('Not found')

    expect(call.getUser).toHaveBeenCalled()
    expect(call.notFound).toHaveBeenCalled()
    expect(challengingService.fetchChallengeNavigation).not.toHaveBeenCalled()
    expect(challengingService.fetchChallengeVote).not.toHaveBeenCalled()
  })

  it('should skip navigation lookup and return null navigation for accessible star challenges', async () => {
    const starDto = StarsFaker.fakeDto()
    const userDto = UsersFaker.fakeDto({ unlockedStarsIds: [starDto.id as string] })
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: true,
      starId: starDto.id,
    })

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchChallengeVote.mockResolvedValue(
      new RestResponse({ body: { challengeVote: 'none' } }),
    )
    spaceService.fetchStarById.mockResolvedValue(new RestResponse({ body: starDto }))
    call.getUser.mockResolvedValue(userDto)

    const response = await makeAction(true).handle(call)

    expect(challengingService.fetchChallengeNavigation).not.toHaveBeenCalled()
    expect(response.userChallengeVote).toBe('none')
    expect(response.previousChallengeSlug).toBeNull()
    expect(response.nextChallengeSlug).toBeNull()
    expect(response.challengeDto).toEqual(
      expect.objectContaining({
        id: challengeDto.id,
        starId: challengeDto.starId,
        isPublic: challengeDto.isPublic,
      }),
    )
  })

  it('should call notFound when a private challenge is accessed by a non-author user', async () => {
    const userDto = UsersFaker.fakeDto({ insigniaRoles: [] })
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: false,
    })

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchChallengeNavigation.mockResolvedValue(
      new RestResponse({ body: ChallengeNavigationFaker.fakeDto() }),
    )
    call.getUser.mockResolvedValue(userDto)

    await expect(makeAction(true).handle(call)).rejects.toThrow('Not found')

    expect(call.notFound).toHaveBeenCalled()
    expect(challengingService.fetchChallengeVote).not.toHaveBeenCalled()
  })

  it('should allow the challenge author to access a private challenge', async () => {
    const userDto = UsersFaker.fakeDto()
    const authorEntity = ChallengesFaker.fakeDto().author.entity
    const postedAt = new Date('2026-03-20T00:00:00.000Z')
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      isPublic: false,
      postedAt,
      author: {
        id: userDto.id as string,
        entity: authorEntity,
      },
    })
    const navigationDto = ChallengeNavigationFaker.fakeDto({
      previousChallengeSlug: null,
      nextChallengeSlug: 'linked-lists',
    })
    const expectedChallengeDto = Challenge.create(challengeDto).dto

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchChallengeNavigation.mockResolvedValue(
      new RestResponse({ body: navigationDto }),
    )
    challengingService.fetchChallengeVote.mockResolvedValue(
      new RestResponse({ body: { challengeVote: 'none' } }),
    )
    call.getUser.mockResolvedValue(userDto)

    const response = await makeAction(true).handle(call)

    expect(call.notFound).not.toHaveBeenCalled()
    expect(response).toEqual({
      challengeDto: expectedChallengeDto,
      userChallengeVote: 'none',
      previousChallengeSlug: null,
      nextChallengeSlug: 'linked-lists',
    })
  })
})
