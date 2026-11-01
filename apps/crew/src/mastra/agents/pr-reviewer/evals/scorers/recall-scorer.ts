import { createScorer } from '@mastra/core/evals'

import type { ReviewEvalGroundTruth } from '@/mastra/agents/pr-reviewer/types/review-eval-ground-truth'
import { ReviewScoringHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-scoring-helper'

const reviewScoringHelper = new ReviewScoringHelper()

export const recallScorer = createScorer({
  id: 'found-expected-recall',
  description:
    'Share of the expected findings (path, area and line range) that the review reported.',
})
  .preprocess(({ run }) => ({
    output: reviewScoringHelper.readOutput(run.output),
    expected: (run.groundTruth as ReviewEvalGroundTruth).expected,
  }))
  .generateScore(({ results }) =>
    reviewScoringHelper.calculateRecall(
      results.preprocessStepResult.output,
      results.preprocessStepResult.expected,
    ),
  )
