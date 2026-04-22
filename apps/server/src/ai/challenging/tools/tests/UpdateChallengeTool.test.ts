import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import {
  GetChallengeUseCase,
  UpdateChallengeUseCase,
} from '@stardust/core/challenging/use-cases'
import type { Mcp } from '@stardust/core/global/interfaces'

import { UpdateChallengeTool } from '../UpdateChallengeTool'

describe('Update Challenge Tool', () => {
  let repository: Mock<ChallengesRepository>
  let mcp: Mock<Mcp<any>>
  let tool: UpdateChallengeTool

  beforeEach(() => {
    jest.restoreAllMocks()
    repository = mock()
    mcp = mock()
    tool = new UpdateChallengeTool(repository)
  })

  it('should throw ChallengeNotFoundError when account is not challenge author', async () => {
    mcp.getAccountId.mockReturnValue('34de8db6-c4c6-41fe-af7c-59f5099ce377')
    mcp.getInput.mockReturnValue({
      challengeId: 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e',
      title: 'Novo titulo',
      description: 'Nova descricao',
      code: 'funcao resolver() {}',
      difficultyLevel: 'easy',
      testCases: [
        {
          inputs: [1],
          expectedOutput: 1,
          isLocked: false,
          position: 1,
        },
      ],
      categories: [{ id: '6e1df5cb-ad7d-42b7-9178-93566276564a', name: 'listas' }],
    })

    jest.spyOn(GetChallengeUseCase.prototype, 'execute').mockResolvedValue({
      id: 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e',
      title: 'Titulo atual',
      description: 'Descricao atual',
      code: 'funcao resolver() {}',
      difficultyLevel: 'easy',
      testCases: [
        {
          inputs: [1],
          expectedOutput: 1,
          isLocked: false,
          position: 1,
        },
      ],
      categories: [{ id: '6e1df5cb-ad7d-42b7-9178-93566276564a', name: 'listas' }],
      author: {
        id: '16a8d130-18f7-455c-8f37-f1f90f648428',
      },
      isPublic: false,
    })

    const executeSpy = jest.spyOn(UpdateChallengeUseCase.prototype, 'execute')

    await expect(tool.handle(mcp)).rejects.toThrow(ChallengeNotFoundError)
    expect(executeSpy).not.toHaveBeenCalled()
  })

  it('should update isPublic when account is challenge author', async () => {
    const accountId = '34de8db6-c4c6-41fe-af7c-59f5099ce377'
    const challengeId = 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e'

    mcp.getAccountId.mockReturnValue(accountId)
    mcp.getInput.mockReturnValue({
      challengeId,
      title: 'Novo titulo',
      description: 'Nova descricao',
      code: 'funcao resolver() {}',
      isPublic: true,
      difficultyLevel: 'easy',
      testCases: [
        {
          inputs: [1],
          expectedOutput: 1,
          isLocked: false,
          position: 1,
        },
      ],
      categories: [{ id: '6e1df5cb-ad7d-42b7-9178-93566276564a', name: 'listas' }],
    })

    jest.spyOn(GetChallengeUseCase.prototype, 'execute').mockResolvedValue({
      id: challengeId,
      title: 'Titulo atual',
      description: 'Descricao atual',
      code: 'funcao resolver() {}',
      difficultyLevel: 'easy',
      testCases: [
        {
          inputs: [1],
          expectedOutput: 1,
          isLocked: false,
          position: 1,
        },
      ],
      categories: [{ id: '6e1df5cb-ad7d-42b7-9178-93566276564a', name: 'listas' }],
      author: {
        id: accountId,
      },
      isPublic: false,
    })

    const executeSpy = jest
      .spyOn(UpdateChallengeUseCase.prototype, 'execute')
      .mockResolvedValue({} as never)

    await tool.handle(mcp)

    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        challengeDto: expect.objectContaining({
          isPublic: true,
        }),
      }),
    )
  })
})
