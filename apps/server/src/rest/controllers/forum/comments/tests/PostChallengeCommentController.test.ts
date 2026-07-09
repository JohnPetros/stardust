import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import { PostChallengeCommentUseCase } from '@stardust/core/forum/use-cases'

import { PostChallengeCommentController } from '../PostChallengeCommentController'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: {
    content: string
  }
}

describe('Post Challenge Comment Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<CommentsRepository>
  let controller: PostChallengeCommentController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new PostChallengeCommentController(repository)
  })

  it('should post challenge comment with route params, body and account data', async () => {
    const body = { content: 'Novo comentario' }
    const account = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@test.com',
      name: 'User',
      isAuthenticated: true,
    }
    const response = { id: 'comment-id' }
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId: 'challenge-id' })
    http.getBody.mockResolvedValue(body)
    http.getAccount.mockResolvedValue(account)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(PostChallengeCommentUseCase.prototype, 'execute')
      .mockResolvedValue(response as never)

    const result = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      challengeId: 'challenge-id',
      commentDto: {
        content: body.content,
        author: {
          id: account.id,
        },
      },
    })
    expect(http.statusCreated).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(response)
    expect(result).toBe(restResponse)
  })
})
