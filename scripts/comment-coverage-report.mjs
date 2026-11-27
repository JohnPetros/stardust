import { readFileSync } from 'node:fs'

// Keeps one coverage comment per workspace. The report already starts with the
// marker that write-coverage-report.mjs adds.
export async function commentCoverageReport({ github, context, workspace, reportPath }) {
  const marker = `<!-- coverage-report:${workspace} -->`
  const repository = { owner: context.repo.owner, repo: context.repo.repo }
  const issue = { ...repository, issue_number: context.issue.number }
  const body = readFileSync(reportPath, 'utf8')
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...issue,
    per_page: 100,
  })
  const existing = comments.find(
    (comment) => comment.user?.type === 'Bot' && comment.body?.includes(marker),
  )
  if (existing) {
    await github.rest.issues.updateComment({
      ...repository,
      comment_id: existing.id,
      body,
    })
    return 'updated'
  }
  await github.rest.issues.createComment({ ...issue, body })
  return 'created'
}
