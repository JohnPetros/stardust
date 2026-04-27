import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import {
  ChallengeCategoriesFaker,
  ChallengesFaker,
} from '@stardust/core/challenging/entities/fakers'
import type { Call } from '@stardust/core/global/interfaces'
import { Slug } from '@stardust/core/global/structures'
import { RestResponse } from '@stardust/core/global/responses'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { AccessChallengeEditorPageAction } from '../AccessChallengeEditorPage'

describe('Access Challenge Editor Page Action', () => {
  let call: Mock<Call<{ challengeSlug: string }>>
  let challengingService: Mock<ChallengingService>

  const challengeSlug = 'binary-search'

  beforeEach(() => {
    call = mock<Call<{ challengeSlug: string }>>()
    challengingService = mock<ChallengingService>()

    call.getRequest.mockReturnValue({ challengeSlug })
    call.notFound.mockImplementation(() => {
      throw new Error('Not found')
    })
  })

  it('should return challenge and categories for challenge author', async () => {
    const userDto = UsersFaker.fakeDto()
    const challengeDto = ChallengesFaker.fakeDto({
      slug: challengeSlug,
      author: {
        id: userDto.id as string,
        entity: ChallengesFaker.fakeDto().author.entity,
      },
    })
    const categoriesDto = ChallengeCategoriesFaker.fakeManyDto(3)

    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchAllChallengeCategories.mockResolvedValue(
      new RestResponse({ body: categoriesDto }),
    )

    const action = AccessChallengeEditorPageAction(challengingService)
    const response = await action.handle(call)

    expect(challengingService.fetchChallengeBySlug).toHaveBeenCalledWith(
      Slug.create(challengeSlug),
    )
    expect(challengingService.fetchAllChallengeCategories).toHaveBeenCalled()
    expect(call.notFound).not.toHaveBeenCalled()
    expect(response).toEqual({
      challenge: expect.objectContaining({ id: challengeDto.id }),
      categories: categoriesDto,
    })
  })

  it('should allow god user to access editor even when not author', async () => {
    const userDto = UsersFaker.fakeDto({ insigniaRoles: ['god'] })
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })
    const categoriesDto = ChallengeCategoriesFaker.fakeManyDto(2)

    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchAllChallengeCategories.mockResolvedValue(
      new RestResponse({ body: categoriesDto }),
    )

    const action = AccessChallengeEditorPageAction(challengingService)
    const response = await action.handle(call)

    expect(call.notFound).not.toHaveBeenCalled()
    expect(response.categories).toEqual(categoriesDto)
  })

  it('should call notFound when user is not author and not god', async () => {
    const userDto = UsersFaker.fakeDto({ insigniaRoles: [] })
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })
    const categoriesDto = ChallengeCategoriesFaker.fakeManyDto(1)

    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchAllChallengeCategories.mockResolvedValue(
      new RestResponse({ body: categoriesDto }),
    )

    const action = AccessChallengeEditorPageAction(challengingService)

    await expect(action.handle(call)).rejects.toThrow('Not found')

    expect(call.notFound).toHaveBeenCalled()
  })

  it('should call notFound when challenge is not found', async () => {
    const userDto = UsersFaker.fakeDto()

    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Challenge not found' }),
    )

    const action = AccessChallengeEditorPageAction(challengingService)

    await expect(action.handle(call)).rejects.toThrow('Not found')

    expect(call.notFound).toHaveBeenCalled()
    expect(challengingService.fetchAllChallengeCategories).not.toHaveBeenCalled()
  })

  it('should call notFound when challenge service throws', async () => {
    const userDto = UsersFaker.fakeDto()

    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockRejectedValue(
      new Error('Unexpected error'),
    )

    const action = AccessChallengeEditorPageAction(challengingService)

    await expect(action.handle(call)).rejects.toThrow('Not found')

    expect(call.notFound).toHaveBeenCalled()
  })

  it('should throw when categories lookup fails', async () => {
    const userDto = UsersFaker.fakeDto({ insigniaRoles: ['god'] })
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })

    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchAllChallengeCategories.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Categories failed' }),
    )

    const action = AccessChallengeEditorPageAction(challengingService)

    await expect(action.handle(call)).rejects.toThrow('Categories failed')
  })
})
