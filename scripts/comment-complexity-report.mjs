import { readFileSync } from 'node:fs'

// GitHub rejects comment bodies longer than 65,536 characters.
const REPORT_LIMIT = 60_000

function fitReport(report) {
  if (report.length <= REPORT_LIMIT) return report
  const kept = report.slice(0, report.lastIndexOf('\n', REPORT_LIMIT))
  const isOpen = kept.includes('<details>') && !kept.includes('</details>')
  return `${kept}\n${isOpen ? '\n</details>\n' : ''}\nShortened. The job summary has the full report.\n`
}

// Keeps one comment per workspace. A change with nothing to report gets no new comment,
// but an existing one is still updated so it never shows an outdated result.
export async function commentComplexityReport({
  github,
  context,
  workspace,
  reportPath,
  hasFindings,
}) {
  const marker = `<!-- complexity-report:${workspace} -->`
  const repository = { owner: context.repo.owner, repo: context.repo.repo }
  const issue = { ...repository, issue_number: context.issue.number }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...issue,
    per_page: 100,
  })
  const existing = comments.find(
    (comment) => comment.user?.type === 'Bot' && comment.body?.includes(marker),
  )
  if (!existing && !hasFindings) return 'skipped'
  const runUrl = `${context.serverUrl}/${repository.owner}/${repository.repo}/actions/runs/${context.runId}`
  const report = fitReport(readFileSync(reportPath, 'utf8'))
  const body = `${marker}\n${report}\n[View the run](${runUrl})`
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
