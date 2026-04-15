import { mock, type Mock } from 'ts-jest-mocker'

import type { CacheProvider, Http } from '@stardust/core/global/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'
import { CodeExplanationLimitExceededError } from '@stardust/core/lesson/errors'
import type { ExplainCodeWorkflow } from '@stardust/core/lesson/interfaces'
import {
  GetRemainingCodeExplanationUsesUseCase,
  RegisterCodeExplanationUsageUseCase,
} from '@stardust/core/lesson/use-cases'

import { ExplainCodeController } from '../ExplainCodeController'

type Schema = {
  body: {
    code: string
  }
}

describe('Explain Code Controller', () => {
  let http: Mock<Http<Schema>>
  let cacheProvider: Mock<CacheProvider>
  let explainCodeWorkflow: Mock<ExplainCodeWorkflow>
  let controller: ExplainCodeController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    cacheProvider = mock()
    explainCodeWorkflow = mock()
    controller = new ExplainCodeController(cacheProvider, explainCodeWorkflow)
  })

  it('should use the authenticated user id and return the explanation on success', async () => {
    const authenticatedUserId = 'authenticated-user-id'
    const bodyUserId = 'body-user-id'
    const body = { code: 'const answer = 42', userId: bodyUserId } as Schema['body'] & {
      userId: string
    }
    const explanation = 'Esta linha declara uma constante.'
    const restResponse = mock<RestResponse<{ explanation: string }>>()

    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(authenticatedUserId)
    http.send.mockReturnValue(restResponse)
    explainCodeWorkflow.run.mockResolvedValue(explanation)

    const getRemainingUsesSpy = jest
      .spyOn(GetRemainingCodeExplanationUsesUseCase.prototype, 'execute')
      .mockResolvedValue({ remainingUses: 3 })
    const registerUsageSpy = jest
      .spyOn(RegisterCodeExplanationUsageUseCase.prototype, 'execute')
      .mockResolvedValue({ remainingUses: 2 })

    const result = await controller.handle(http)

    expect(http.getAccountId).toHaveBeenCalled()
    expect(getRemainingUsesSpy).toHaveBeenCalledWith({ userId: authenticatedUserId })
    expect(explainCodeWorkflow.run).toHaveBeenCalledWith(body.code)
    expect(registerUsageSpy).toHaveBeenCalledWith({ userId: authenticatedUserId })
    expect(registerUsageSpy).not.toHaveBeenCalledWith({ userId: bodyUserId })
    expect(http.send).toHaveBeenCalledWith({ explanation })
    expect(result).toBe(restResponse)
  })

  it('should return forbidden when there are no remaining uses before workflow execution', async () => {
    const authenticatedUserId = 'authenticated-user-id'
    const body = { code: 'print("hello")' }

    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(authenticatedUserId)

    const getRemainingUsesSpy = jest
      .spyOn(GetRemainingCodeExplanationUsesUseCase.prototype, 'execute')
      .mockResolvedValue({ remainingUses: 0 })
    const registerUsageSpy = jest.spyOn(
      RegisterCodeExplanationUsageUseCase.prototype,
      'execute',
    )

    const result = await controller.handle(http)

    expect(getRemainingUsesSpy).toHaveBeenCalledWith({ userId: authenticatedUserId })
    expect(explainCodeWorkflow.run).not.toHaveBeenCalled()
    expect(registerUsageSpy).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
    expect(result).toBeInstanceOf(RestResponse)
    expect(result.statusCode).toBe(HTTP_STATUS_CODE.forbidden)
    expect(result.errorMessage).toBe('Code explanation daily limit exceeded')
  })

  it('should return forbidden when usage registration exceeds the limit after workflow success', async () => {
    const authenticatedUserId = 'authenticated-user-id'
    const body = { code: 'let score = total / count' }

    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(authenticatedUserId)
    explainCodeWorkflow.run.mockResolvedValue('A expressao divide total por count.')

    const getRemainingUsesSpy = jest
      .spyOn(GetRemainingCodeExplanationUsesUseCase.prototype, 'execute')
      .mockResolvedValue({ remainingUses: 1 })
    const registerUsageSpy = jest
      .spyOn(RegisterCodeExplanationUsageUseCase.prototype, 'execute')
      .mockRejectedValue(new CodeExplanationLimitExceededError())

    const result = await controller.handle(http)

    expect(getRemainingUsesSpy).toHaveBeenCalledWith({ userId: authenticatedUserId })
    expect(explainCodeWorkflow.run).toHaveBeenCalledWith(body.code)
    expect(registerUsageSpy).toHaveBeenCalledWith({ userId: authenticatedUserId })
    expect(http.send).not.toHaveBeenCalled()
    expect(result).toBeInstanceOf(RestResponse)
    expect(result.statusCode).toBe(HTTP_STATUS_CODE.forbidden)
    expect(result.errorMessage).toBe('Code explanation daily limit exceeded')
  })
})
