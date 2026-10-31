import { createScorer } from '@mastra/core/evals'
import { ReviewScoringHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-scoring-helper'

const reviewScoringHelper = new ReviewScoringHelper()

export const validOutputScorer = createScorer({
  id: 'valid-review-output',
  description: 'The review finished and its output matches the output schema.',
})
  .analyze(({ run }) => ({ isValid: reviewScoringHelper.isValidOutput(run.output) }))
  .generateScore(({ results }) => (results.analyzeStepResult.isValid ? 1 : 0))
