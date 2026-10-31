export type ReviewerFailure =
  | 'timeout'
  | 'step_limit'
  | 'empty_answer'
  | 'invalid_output'
  | 'structuring_failed'
  | 'reviewer_failed'
