import { mock, type Mock } from 'ts-jest-mocker'

import { UpvoteCommentUseCase } from '@stardust/core/forum/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

import { UpvoteCommentController } from '../UpvoteCommentController'

describe('Upvote Comment Controller', () => {
  type Schema = {
    routeParams: {
      commentId: string
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<UsersRepository>
  let controller: UpvoteCommentController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new UpvoteCommentController(repository)
  })

  it('should read route params and account, execute use case and send response', async () => {
    const commentId = 'comment-1'
    const account = { id: 42 }
    const upvoteDto = { isUpvoted: true }
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ commentId })
    http.getAccount.mockResolvedValue(account as never)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpvoteCommentUseCase.prototype, 'execute')
      .mockResolvedValue(upvoteDto as never)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      commentId,
      userId: String(account.id),
    })
    expect(http.send).toHaveBeenCalledWith(upvoteDto)
    expect(response).toBe(restResponse)
  })
})
