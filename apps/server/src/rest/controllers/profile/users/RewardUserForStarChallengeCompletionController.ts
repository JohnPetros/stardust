import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Broker, Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { Id } from '@stardust/core/global/structures'
import { NotAllowedError } from '@stardust/core/global/errors'
import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import {
  CalculateRewardForChallengeCompletionUseCase,
  CompleteSpaceUseCase,
  CompleteChallengeUseCase,
  RemoveRecentlyUnlockedStarUseCase,
  RewardUserUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

type Schema = {
  routeParams: {
    userId: string
  }
  body: {
    challengeId: string
    challengeReward?: {
      xp: number
      coins: number
    }
    nextStarId?: string
    starId: string
  }
}

export class RewardUserForStarChallengeCompletionController
  implements Controller<Schema>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly challengesRepository: ChallengesRepository,
    private readonly executionsRepository: ChallengeCodeExecutionsRepository,
    private readonly broker: Broker = new InngestBroker(),
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const body = await http.getBody()
    return this.database.run(async () => http.send(await this.complete(userId, body)))
  }

  private async complete(userId: string, body: Schema['body']) {
    const counts = await this.getTrustedExecutionCounts(userId, body.challengeId)
    await this.completeSpace(userId, body.nextStarId ?? null)
    const reward = await this.calculateReward(userId, body, counts)
    await this.completeStarChallenge(userId, body)
    return this.applyReward(userId, reward)
  }

  private async applyReward(
    userId: string,
    reward: Awaited<
      ReturnType<RewardUserForStarChallengeCompletionController['calculateReward']>
    >,
  ) {
    const progress = await this.rewardUser(userId, reward.newCoins, reward.newXp)
    return { ...reward, ...progress }
  }

  private async completeStarChallenge(userId: string, body: Schema['body']) {
    await this.unlockNextStar(userId, body.nextStarId)
    await this.removeRecentlyUnlockedStar(userId, body.starId)
    await this.completeChallenge(userId, body.challengeId)
  }

  private async getTrustedExecutionCounts(userId: string, challengeId: string) {
    const evidence = await this.fetchExecutionEvidence(userId, challengeId)
    return this.trustedExecutionCounts(evidence)
  }

  private trustedExecutionCounts(
    evidence: Awaited<
      ReturnType<RewardUserForStarChallengeCompletionController['fetchExecutionEvidence']>
    >,
  ) {
    const [challenge, latestExecution, incorrectAnswersCount] = evidence
    this.verifyExecutionEvidence(challenge, latestExecution?.isAccepted)

    return this.executionCounts(
      challenge.maximumIncorrectAnswersCount.value,
      incorrectAnswersCount.value,
    )
  }

  private executionCounts(
    maximumIncorrectAnswersCount: number,
    incorrectAnswersCount: number,
  ) {
    return { maximumIncorrectAnswersCount, incorrectAnswersCount }
  }

  private fetchExecutionEvidence(userIdValue: string, challengeIdValue: string) {
    const userId = Id.create(userIdValue)
    const challengeId = Id.create(challengeIdValue)
    return this.queryExecutionEvidence(userId, challengeId)
  }

  private queryExecutionEvidence(userId: Id, challengeId: Id) {
    return Promise.all([
      this.challengesRepository.findById(challengeId),
      this.executionsRepository.findLatestByUserAndChallenge(userId, challengeId),
      this.executionsRepository.countIncorrectByUserAndChallenge(userId, challengeId),
    ])
  }

  private verifyExecutionEvidence(
    challenge: Awaited<ReturnType<ChallengesRepository['findById']>>,
    isAccepted: boolean | undefined,
  ): asserts challenge is NonNullable<typeof challenge> {
    if (!challenge) throw new ChallengeNotFoundError()
    this.verifyAcceptedExecution(isAccepted)
  }

  private verifyAcceptedExecution(isAccepted: boolean | undefined) {
    if (!isAccepted) {
      throw new NotAllowedError(
        'É necessário executar o código com sucesso antes da recompensa',
      )
    }
  }

  private calculateReward(
    userId: string,
    body: Schema['body'],
    counts: { maximumIncorrectAnswersCount: number; incorrectAnswersCount: number },
  ) {
    const useCase = new CalculateRewardForChallengeCompletionUseCase(this.usersRepository)
    return useCase.execute(this.rewardInput(userId, body, counts))
  }

  private rewardInput(
    userId: string,
    body: Schema['body'],
    counts: { maximumIncorrectAnswersCount: number; incorrectAnswersCount: number },
  ) {
    return {
      userId,
      challengeId: body.challengeId,
      ...this.baseReward(body.challengeReward),
      ...counts,
    }
  }

  private baseReward(reward: Schema['body']['challengeReward']) {
    return { challengeXp: reward?.xp ?? 0, challengeCoins: reward?.coins ?? 0 }
  }

  private async completeChallenge(userId: string, challengeId: string) {
    const useCase = this.createCompleteChallengeUseCase()
    await useCase.execute({ userId, challengeId })
  }

  private async unlockNextStar(userId: string, starId?: string) {
    if (starId) await this.unlockStar(userId, starId)
  }

  private async unlockStar(userId: string, starId: string) {
    const useCase = this.createUnlockStarUseCase()
    await useCase.execute({ userId, starId })
  }

  private async removeRecentlyUnlockedStar(userId: string, starId: string) {
    const useCase = new RemoveRecentlyUnlockedStarUseCase(this.usersRepository)
    return await useCase.execute({ userId, starId })
  }

  private async rewardUser(userId: string, newCoins: number, newXp: number) {
    const useCase = this.createRewardUserUseCase()
    return await useCase.execute({ userId, newCoins, newXp })
  }

  private async completeSpace(userId: string, nextStarId: string | null) {
    const useCase = this.createCompleteSpaceUseCase()
    await useCase.execute({ userId, nextStarId })
  }

  private createCompleteChallengeUseCase() {
    return new CompleteChallengeUseCase(this.database, this.usersRepository, this.broker)
  }

  private createUnlockStarUseCase() {
    return new UnlockStarUseCase(this.database, this.usersRepository, this.broker)
  }

  private createRewardUserUseCase() {
    return new RewardUserUseCase(this.database, this.usersRepository, this.broker)
  }

  private createCompleteSpaceUseCase() {
    return new CompleteSpaceUseCase(this.database, this.usersRepository, this.broker)
  }
}
