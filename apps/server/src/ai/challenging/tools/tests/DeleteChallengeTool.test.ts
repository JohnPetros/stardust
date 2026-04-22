import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import {
  DeleteChallengeUseCase,
  GetChallengeUseCase,
} from '@stardust/core/challenging/use-cases'
import type { Mcp } from '@stardust/core/global/interfaces'

import { DeleteChallengeTool } from '../DeleteChallengeTool'

describe('Delete Challenge Tool', () => {
  let repository: Mock<ChallengesRepository>
  let mcp: Mock<Mcp<any>>
  let tool: DeleteChallengeTool

  beforeEach(() => {
    jest.restoreAllMocks()
    repository = mock()
    mcp = mock()
    tool = new DeleteChallengeTool(repository)
  })

  it('should delete challenge when account is author and confirmation is true', async () => {
    const accountId = '6b87dbf7-9950-46de-b0bb-3af049bf5cc2'
    const challengeId = 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e'

    mcp.getAccountId.mockReturnValue(accountId)
    mcp.getInput.mockReturnValue({ challengeId, confirmacao: true })

    const getSpy = jest
      .spyOn(GetChallengeUseCase.prototype, 'execute')
      .mockResolvedValue({
        id: challengeId,
        title: 'Desafio de lista',
        description: 'Descricao valida',
        code: 'funcao resolver() {}',
        difficultyLevel: 'easy',
        testCases: [
          {
            inputs: [1],
            expectedOutput: 1,
            isLocked: false,
            position: 1,
          },
          {
            inputs: [2],
            expectedOutput: 2,
            isLocked: false,
            position: 2,
          },
          {
            inputs: [3],
            expectedOutput: 3,
            isLocked: true,
            position: 3,
          },
        ],
        categories: [{ id: '6e1df5cb-ad7d-42b7-9178-93566276564a', name: 'listas' }],
        author: {
          id: accountId,
        },
        isPublic: false,
      })
    const deleteSpy = jest
      .spyOn(DeleteChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(undefined as never)

    await tool.handle(mcp)

    expect(getSpy).toHaveBeenCalledWith({ challengeId })
    expect(deleteSpy).toHaveBeenCalledWith({ challengeId })
  })

  it.each([
    { challengeId: 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e', confirmacao: false },
    { challengeId: 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e' },
  ])('should require explicit confirmation before deleting: %j', async (input) => {
    mcp.getAccountId.mockReturnValue('6b87dbf7-9950-46de-b0bb-3af049bf5cc2')
    mcp.getInput.mockReturnValue(input)

    const getSpy = jest.spyOn(GetChallengeUseCase.prototype, 'execute')
    const deleteSpy = jest.spyOn(DeleteChallengeUseCase.prototype, 'execute')

    await expect(tool.handle(mcp)).rejects.toThrow(
      'A confirmacao explicita e obrigatoria para excluir desafios.',
    )

    expect(getSpy).not.toHaveBeenCalled()
    expect(deleteSpy).not.toHaveBeenCalled()
  })

  it('should throw ChallengeNotFoundError when account is not author', async () => {
    mcp.getAccountId.mockReturnValue('6b87dbf7-9950-46de-b0bb-3af049bf5cc2')
    mcp.getInput.mockReturnValue({
      challengeId: 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e',
      confirmacao: true,
    })

    jest.spyOn(GetChallengeUseCase.prototype, 'execute').mockResolvedValue({
      id: 'f246350e-c2ad-4e6a-b8bd-57e979f1a62e',
      title: 'Desafio de lista',
      description: 'Descricao valida',
      code: 'funcao resolver() {}',
      difficultyLevel: 'easy',
      testCases: [
        {
          inputs: [1],
          expectedOutput: 1,
          isLocked: false,
          position: 1,
        },
        {
          inputs: [2],
          expectedOutput: 2,
          isLocked: false,
          position: 2,
        },
        {
          inputs: [3],
          expectedOutput: 3,
          isLocked: true,
          position: 3,
        },
      ],
      categories: [{ id: '6e1df5cb-ad7d-42b7-9178-93566276564a', name: 'listas' }],
      author: {
        id: '1f5437bf-ef5f-4759-9b58-39a6d7e95ea8',
      },
      isPublic: false,
    })

    await expect(tool.handle(mcp)).rejects.toThrow(ChallengeNotFoundError)
  })
})
