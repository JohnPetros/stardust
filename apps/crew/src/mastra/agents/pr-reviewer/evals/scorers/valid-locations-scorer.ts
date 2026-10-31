import { createScorer } from '@mastra/core/evals'

import type { ReviewInput } from '@/mastra/agents/pr-reviewer/types/review-input'
import { ReviewScoringHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-scoring-helper'

const reviewScoringHelper = new ReviewScoringHelper()

export const validLocationsScorer = createScorer({
  id: 'valid-path-and-line',
  description: 'Share of findings on a changed file and a changed line.',
})
  .preprocess(({ run }) => ({
    output: reviewScoringHelper.readOutput(run.output),
    input: run.input as ReviewInput,
  }))
  .generateScore(({ results }) =>
    reviewScoringHelper.calculateValidLocations(
      results.preprocessStepResult.output,
      results.preprocessStepResult.input,
    ),
  )
