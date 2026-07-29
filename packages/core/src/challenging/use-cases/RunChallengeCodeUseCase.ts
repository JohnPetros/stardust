import { Code, Id } from '#global/domain/structures/index'
import { LspError } from '#global/domain/errors/index'
import type { LspProvider, UseCase } from '#global/interfaces/index'
import type { LspResponse } from '#global/responses/index'
import type { TestCase } from '../domain/structures'
import { ChallengeCodeExecution } from '../domain/structures'
import type {
  ChallengeCodeExecutionDto,
  ChallengeCodeExecutionErrorDto,
  ChallengeCodeExecutionTestResultDto,
} from '../domain/structures/dtos'
import { ChallengeNotFoundError, InsufficientInputsError } from '../domain/errors/index'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '../interfaces'

type Request = {
  userId: string
  challengeId: string
  code: string
}

type Response = Promise<ChallengeCodeExecutionDto>

type ExecutionStatus = ChallengeCodeExecutionDto['status']

export class RunChallengeCodeUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly executionsRepository: ChallengeCodeExecutionsRepository,
    private readonly lspProvider: LspProvider,
  ) {}

  async execute(request: Request): Response {
    const userId = Id.create(request.userId)
    const challengeId = Id.create(request.challengeId)
    const challenge = await this.challengesRepository.findById(challengeId)

    if (!challenge) throw new ChallengeNotFoundError()

    const syntaxAnalysis = await this.lspProvider.performSyntaxAnalysis(request.code)

    if (syntaxAnalysis.isFailure) {
      return await this.persistExecution({
        userId,
        challengeId,
        code: request.code,
        status: 'syntax_error',
        testResults: [],
        outputs: [],
        error: this.createErrorFromLspResponse(syntaxAnalysis, false),
      })
    }

    try {
      const code = Code.create(this.lspProvider, request.code)
      const initialCode = Code.create(this.lspProvider, challenge.initialCode.value)
      const shouldUseFunctionResult = challenge.shouldUseFunctionResult(initialCode)

      if (
        shouldUseFunctionResult.isTrue &&
        code.firstFunctionName !== initialCode.firstFunctionName
      ) {
        return await this.persistExecution({
          userId,
          challengeId,
          code: request.code,
          status: 'runtime_error',
          testResults: [],
          outputs: [],
          error: {
            message: 'A função do desafio foi modificada',
            line: null,
            isInternal: false,
          },
        })
      }

      const outputs: string[] = []
      const testResults: ChallengeCodeExecutionTestResultDto[] = []

      for (const testCase of challenge.testCases) {
        const formattedCode = await this.formatCode(code, initialCode, testCase)
        const response = await formattedCode.run()

        if (response.isFailure) response.throwError()

        outputs.push(...response.outputs)

        const userOutput = await this.getUserOutput({
          response,
          code,
          shouldUseFunctionResult: shouldUseFunctionResult.isTrue,
        })
        const isCorrect = await this.verifyResult(code, userOutput, testCase)

        testResults.push({
          position: testCase.position.value,
          isCorrect,
          userOutput,
          expectedOutput: testCase.expectedOutput,
        })
      }

      return await this.persistExecution({
        userId,
        challengeId,
        code: request.code,
        status: testResults.every((testResult) => testResult.isCorrect)
          ? 'accepted'
          : 'wrong_answer',
        testResults,
        outputs,
        error: null,
      })
    } catch (error) {
      return await this.persistExecution({
        userId,
        challengeId,
        code: request.code,
        status: this.getStatusFromError(error),
        testResults: [],
        outputs: [],
        error: this.createErrorFromUnknown(error),
      })
    }
  }

  private async formatCode(code: Code, initialCode: Code, testCase: TestCase) {
    if (initialCode.hasFunction.isTrue) {
      return await code.addFunctionCall(initialCode.firstFunctionName, testCase.inputs)
    }

    if (code.inputsCount !== testCase.inputs.length) throw new InsufficientInputsError()

    return await code.addInputs(testCase.inputs)
  }

  private async getUserOutput({
    response,
    code,
    shouldUseFunctionResult,
  }: {
    response: LspResponse
    code: Code
    shouldUseFunctionResult: boolean
  }) {
    if (shouldUseFunctionResult) return response.result

    const output = response.outputs[0]
    if (!output) return ''

    const formattedCode = await code.format(output)
    return formattedCode.value
  }

  private async verifyResult(code: Code, userOutput: unknown, testCase: TestCase) {
    const translatedUserOutput = await code.translateToLsp(userOutput)
    const translatedExpectedOutput = await code.translateToLsp(testCase.expectedOutput)

    return translatedUserOutput === translatedExpectedOutput
  }

  private async persistExecution({
    userId,
    challengeId,
    code,
    status,
    testResults,
    outputs,
    error,
  }: {
    userId: Id
    challengeId: Id
    code: string
    status: ExecutionStatus
    testResults: ChallengeCodeExecutionTestResultDto[]
    outputs: string[]
    error: ChallengeCodeExecutionErrorDto | null
  }) {
    const execution = ChallengeCodeExecution.create({
      code,
      status,
      testResults,
      outputs,
      error,
    })

    await this.executionsRepository.add(userId, challengeId, execution)

    return execution.dto
  }

  private createErrorFromLspResponse(
    response: LspResponse,
    isInternal: boolean,
  ): ChallengeCodeExecutionErrorDto {
    const error = response.errors[0]

    if (error) {
      return {
        message: error.message,
        line: error.line,
        isInternal,
      }
    }

    return {
      message: response.errorMessage,
      line: response.errorLine,
      isInternal,
    }
  }

  private createErrorFromUnknown(error: unknown): ChallengeCodeExecutionErrorDto {
    if (error instanceof LspError || error instanceof InsufficientInputsError) {
      return {
        message: error.message,
        line: error instanceof LspError ? error.line : null,
        isInternal: false,
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        line: null,
        isInternal: true,
      }
    }

    return {
      message: 'Erro inesperado ao executar código',
      line: null,
      isInternal: true,
    }
  }

  private getStatusFromError(error: unknown): ExecutionStatus {
    if (error instanceof LspError || error instanceof InsufficientInputsError)
      return 'runtime_error'

    return 'internal_error'
  }
}
