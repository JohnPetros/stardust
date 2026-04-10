import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { CacheProvider } from '@stardust/core/global/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'
import { CodeExplanationLimitExceededError } from '@stardust/core/lesson/errors'
import type { ExplainCodeWorkflow } from '@stardust/core/lesson/interfaces'
import {
  GetRemainingCodeExplanationUsesUseCase,
  RegisterCodeExplanationUsageUseCase,
} from '@stardust/core/lesson/use-cases'

type Schema = {
  body: {
    code: string
  }
}

export class ExplainCodeController implements Controller<Schema> {
  constructor(
    private readonly cacheProvider: CacheProvider,
    private readonly explainCodeWorkflow: ExplainCodeWorkflow,
  ) {}

  async handle(http: Http<Schema>) {
    const { code } = await http.getBody()
    const userId = await http.getAccountId()
    const getRemainingUsesUseCase = new GetRemainingCodeExplanationUsesUseCase(
      this.cacheProvider,
    )

    const { remainingUses } = await getRemainingUsesUseCase.execute({ userId })

    if (remainingUses <= 0) {
      return new RestResponse({
        statusCode: HTTP_STATUS_CODE.forbidden,
        errorMessage: 'Code explanation daily limit exceeded',
      })
    }

    try {
      const explanation = await this.explainCodeWorkflow.run(code)
      const registerCodeExplanationUsageUseCase = new RegisterCodeExplanationUsageUseCase(
        this.cacheProvider,
      )

      await registerCodeExplanationUsageUseCase.execute({ userId })

      return http.send({ explanation })
    } catch (error) {
      if (error instanceof CodeExplanationLimitExceededError) {
        return new RestResponse({
          statusCode: HTTP_STATUS_CODE.forbidden,
          errorMessage: 'Code explanation daily limit exceeded',
        })
      }

      throw error
    }
  }
}
