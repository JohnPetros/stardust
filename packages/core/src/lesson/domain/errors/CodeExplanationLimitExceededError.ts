export class CodeExplanationLimitExceededError extends Error {
  constructor() {
    super('Code explanation daily limit exceeded')
  }
}
