export function buildPullRequestSubjectKey(
  repository: string,
  pullNumber: number,
): string {
  return `${repository.toLowerCase()}#${pullNumber}`
}
