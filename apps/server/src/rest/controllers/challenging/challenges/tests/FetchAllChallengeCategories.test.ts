import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeCategoriesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { FetchAllChallengeCategoriesController } from '../FetchAllChallengeCategories'

describe('Fetch All Challenge Categories Controller', () => {
  let http: Mock<Http>
  let repository: Mock<ChallengesRepository>
  let controller: FetchAllChallengeCategoriesController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new FetchAllChallengeCategoriesController(repository)
  })

  it('should fetch all categories and return their dtos', async () => {
    const categories = [ChallengeCategoriesFaker.fake(), ChallengeCategoriesFaker.fake()]
    const restResponse = mock<RestResponse>()

    repository.findAllCategories.mockResolvedValue(categories)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(repository.findAllCategories).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(categories.map((category) => category.dto))
    expect(response).toBe(restResponse)
  })
})
