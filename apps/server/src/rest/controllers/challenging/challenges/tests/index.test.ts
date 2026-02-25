import {
  AppendChallengeRewardToBodyController,
  DeleteChallengeController,
  FetchAllChallengeCategoriesController,
  FetchAllChallengesController,
  FetchChallengeController,
  FetchChallengesListController,
  FetchChallengeVoteController,
  FetchCompletedChallengesCountByDifficultyLevelController,
  FetchPostedChallengesKpiController,
  PostChallengeController,
  UpdateChallengeController,
  VerifyChallengeManagementPermissionController,
  VoteChallengeController,
} from '..'

describe('challenging/challenges controllers barrel exports', () => {
  it('should export all challenge controllers', () => {
    expect(AppendChallengeRewardToBodyController).toBeDefined()
    expect(DeleteChallengeController).toBeDefined()
    expect(FetchAllChallengeCategoriesController).toBeDefined()
    expect(FetchAllChallengesController).toBeDefined()
    expect(FetchChallengeController).toBeDefined()
    expect(FetchChallengesListController).toBeDefined()
    expect(FetchChallengeVoteController).toBeDefined()
    expect(FetchCompletedChallengesCountByDifficultyLevelController).toBeDefined()
    expect(FetchPostedChallengesKpiController).toBeDefined()
    expect(PostChallengeController).toBeDefined()
    expect(UpdateChallengeController).toBeDefined()
    expect(VerifyChallengeManagementPermissionController).toBeDefined()
    expect(VoteChallengeController).toBeDefined()
  })
})
