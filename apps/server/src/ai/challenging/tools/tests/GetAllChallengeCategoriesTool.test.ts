import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { Mcp } from '@stardust/core/global/interfaces'

import { GetAllChallengeCategoriesTool } from '../GetAllChallengeCategoriesTool'

describe('Get All Challenge Categories Tool', () => {
  let repository: Mock<ChallengesRepository>
  let mcp: Mock<Mcp<void>>
  let tool: GetAllChallengeCategoriesTool

  beforeEach(() => {
    repository = mock()
    mcp = mock()
    tool = new GetAllChallengeCategoriesTool(repository)
  })

  it('should return all challenge categories as dto', async () => {
    repository.findAllCategories.mockResolvedValue([
      { dto: { id: '1', name: 'algorithms' } },
      { dto: { id: '2', name: 'graphs' } },
    ] as any)

    const response = await tool.handle(mcp)

    expect(repository.findAllCategories).toHaveBeenCalled()
    expect(response).toEqual([
      { id: '1', name: 'algorithms' },
      { id: '2', name: 'graphs' },
    ])
  })
})
