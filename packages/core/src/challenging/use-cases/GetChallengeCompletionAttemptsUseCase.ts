import { NotAllowedError } from '#global/domain/errors/index'
import { Id, type Integer } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/index'
import { ChallengeNotFoundError } from '../domain/errors'
import type { Challenge } from '../domain/entities'
import type { ChallengeCodeExecution } from '../domain/structures'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '../interfaces'

const NOT_ACCEPTED_MESSAGE =
  'É necessário executar o código com sucesso antes da recompensa'

type Request = {
  userId: string
  challengeId: string
}

type Attempts = {
  challenge: Challenge
  latestExecution: ChallengeCodeExecution | null
  incorrectAnswersCount: Integer
}

type Response = Promise<{
  maximumIncorrectAnswersCount: number
  incorrectAnswersCount: number
}>

export class GetChallengeCompletionAttemptsUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly executionsRepository: ChallengeCodeExecutionsRepository,
  ) {}

  async execute(request: Request): Response {
    const attempts = await this.findAttempts(request)
    this.assertRewardable(attempts)
    return this.toCounts(attempts)
  }

  private async findAttempts(request: Request) {
    const [challenge, executions] = await Promise.all([
      this.challengesRepository.findById(Id.create(request.challengeId)),
      this.findExecutions(request),
    ])
    return { challenge, ...executions }
  }

  private async findExecutions(request: Request) {
    const [latestExecution, incorrectAnswersCount] = await Promise.all([
      this.findLatestExecution(request),
      this.countIncorrectAnswers(request),
    ])
    return { latestExecution, incorrectAnswersCount }
  }

  private findLatestExecution({ userId, challengeId }: Request) {
    return this.executionsRepository.findLatestByUserAndChallenge(
      Id.create(userId),
      Id.create(challengeId),
    )
  }

  private countIncorrectAnswers({ userId, challengeId }: Request) {
    return this.executionsRepository.countIncorrectByUserAndChallenge(
      Id.create(userId),
      Id.create(challengeId),
    )
  }

  private assertRewardable(
    attempts: Pick<Attempts, 'latestExecution'> & { challenge: Challenge | null },
  ): asserts attempts is Attempts {
    if (!attempts.challenge) throw new ChallengeNotFoundError()
    if (!attempts.latestExecution?.isAccepted) {
      throw new NotAllowedError(NOT_ACCEPTED_MESSAGE)
    }
  }

  private toCounts({ challenge, incorrectAnswersCount }: Attempts) {
    return {
      maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
      incorrectAnswersCount: incorrectAnswersCount.value,
    }
  }
}
