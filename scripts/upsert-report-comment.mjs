// Keeps one bot comment per marker: updates it when it exists, creates it otherwise.
export async function upsertReportComment({ github, context, marker, body }) {
  const repository = { owner: context.repo.owner, repo: context.repo.repo }
  const issue = { ...repository, issue_number: context.issue.number }
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
