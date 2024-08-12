import { ChallengesFaker, UsersFaker } from '@/@core/domain/entities/tests/fakers'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '../CountCompletedChallengesByDifficultyLevelUseCase'
import { ChallengesServiceMock } from '@/@core/__tests__/mocks/services'

let challengesServiceMock: ChallengesServiceMock
let useCase: CountCompletedChallengesByDifficultyLevelUseCase

describe('Count Completed Challenges By Difficulty Level Use Case', () => {
  beforeEach(() => {
    challengesServiceMock = new ChallengesServiceMock()
    useCase = new CountCompletedChallengesByDifficultyLevelUseCase(challengesServiceMock)
  })

  it('should return the absolute count of completed challenges by difficulty', async () => {
    const fakeChallenges = ChallengesFaker.fakeManyDTO(25, { difficulty: 'easy' })
    challengesServiceMock.challenges = fakeChallenges

    const completedChallengesCount = 15

    const fakeUserDTO = UsersFaker.fakeDTO({
      completedChallengesIds: fakeChallenges
        .slice(0, completedChallengesCount)
        .map(({ id }) => String(id)),
    })

    const { absolute } = await useCase.do(fakeUserDTO)

    expect(absolute.easy).toBe(completedChallengesCount)
  })

  it('should return the percentage count of completed challenges by difficulty', async () => {
    const fakeChallenges = ChallengesFaker.fakeManyDTO(25, { difficulty: 'easy' })
    challengesServiceMock.challenges = fakeChallenges

    const completedChallengesCount = 15

    const fakeUserDTO = UsersFaker.fakeDTO({
      completedChallengesIds: fakeChallenges
        .slice(0, completedChallengesCount)
        .map(({ id }) => String(id)),
    })

    const { percentage } = await useCase.do(fakeUserDTO)

    expect(percentage.easy).toBe(60) // 60%
  })

  it('should return the total count of challenges by difficulty', async () => {
    const completedChallengesCount = 25

    const fakeChallenges = ChallengesFaker.fakeManyDTO(completedChallengesCount, {
      difficulty: 'easy',
    })
    challengesServiceMock.challenges = fakeChallenges

    const fakeUserDTO = UsersFaker.fakeDTO({
      completedChallengesIds: fakeChallenges.slice(0, 15).map(({ id }) => String(id)),
    })

    const { total } = await useCase.do(fakeUserDTO)

    expect(total.easy).toBe(completedChallengesCount)
  })
})
