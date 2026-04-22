import { mock, type Mock } from 'ts-jest-mocker'

import { CHALLENGE_CREATION_INSTRUCTIONS } from '@/ai/challenging/constants'

import type { Mcp } from '@stardust/core/global/interfaces'

import { GetChallengeCreationInstructionsTool } from '../GetChallengeCreationInstructionsTool'

describe('Get Challenge Creation Instructions Tool', () => {
  let mcp: Mock<Mcp<void>>
  let tool: GetChallengeCreationInstructionsTool

  beforeEach(() => {
    mcp = mock()
    tool = new GetChallengeCreationInstructionsTool()
  })

  it('should return the stable challenge creation instructions payload', async () => {
    const response = await tool.handle(mcp)

    expect(response).toEqual({
      instructions: CHALLENGE_CREATION_INSTRUCTIONS,
    })
  })
})
