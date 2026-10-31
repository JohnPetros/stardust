import { createScorer } from '@mastra/core/evals'

import type { ReviewEvalGroundTruth } from '@/mastra/agents/pr-reviewer/types/review-eval-ground-truth'
import { ReviewScoringHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-scoring-helper'

const reviewScoringHelper = new ReviewScoringHelper()

export const falsePositivesScorer = createScorer({
  id: 'false-positive-penalty',
  description:
    'Lowers the score for each reported finding whose path and area were not expected.',
})
  .preprocess(({ run }) => ({
    output: reviewScoringHelper.readOutput(run.output),
    expected: (run.groundTruth as ReviewEvalGroundTruth).expected,
  }))
  .generateScore(({ results }) =>
    reviewScoringHelper.calculateFalsePositives(
      results.preprocessStepResult.output,
      results.preprocessStepResult.expected,
    ),
  )
