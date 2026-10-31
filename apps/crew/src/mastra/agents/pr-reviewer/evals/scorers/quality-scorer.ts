import { createScorer } from '@mastra/core/evals'

import type { ReviewEvalGroundTruth } from '@/mastra/agents/pr-reviewer/types/review-eval-ground-truth'
import type { ReviewInput } from '@/mastra/agents/pr-reviewer/types/review-input'
import { ReviewScoringHelper } from '@/mastra/agents/pr-reviewer/evals/helpers/review-scoring-helper'

const reviewScoringHelper = new ReviewScoringHelper()

export const qualityScorer = createScorer({
  id: 'review-quality',
  description: 'Average of recall, false-positive penalty and valid path and line.',
})
  .analyze(({ run }) => {
    const output = reviewScoringHelper.readOutput(run.output)
    const expected = (run.groundTruth as ReviewEvalGroundTruth).expected
    const input = run.input as ReviewInput

    return {
      recall: reviewScoringHelper.calculateRecall(output, expected),
      falsePositives: reviewScoringHelper.calculateFalsePositives(output, expected),
      validLocations: reviewScoringHelper.calculateValidLocations(output, input),
    }
  })
  .generateScore(({ results }) => {
    const { recall, falsePositives, validLocations } = results.analyzeStepResult

    return (recall + falsePositives + validLocations) / 3
  })
  .generateReason(({ results, score }) => {
    const { recall, falsePositives, validLocations } = results.analyzeStepResult

    return `quality ${score.toFixed(2)} from recall ${recall.toFixed(2)}, false positives ${falsePositives.toFixed(2)}, valid locations ${validLocations.toFixed(2)}`
  })
