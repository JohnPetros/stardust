import type { ToolsInput } from '@mastra/core/agent'

const REVIEW_COMMENTS_TOOL_SLUG = 'GITHUB_LIST_REVIEW_COMMENTS_ON_A_PULL_REQUEST'
const PAGE_SIZE = 100
const MAX_PAGES = 10

type ListCommentedLocationsInput = {
  toolset: ToolsInput | undefined
  repository: string
  pullNumber: number
}

type ListCommentsPage = (input: Record<string, unknown>) => Promise<unknown>

type CommentCandidate = { path?: unknown; line?: unknown; side?: unknown }

type CommentsResponse = {
  successful?: unknown
  data?: unknown
}

export class ReviewCommentsLister {
  async listCommentedLocations({
    toolset,
    repository,
    pullNumber,
  }: ListCommentedLocationsInput): Promise<Set<string> | undefined> {
    try {
      const listPage = this.resolveListPage(toolset)

      return listPage
        ? await this.collectLocations(listPage, repository, pullNumber)
        : undefined
    } catch {
      return undefined
    }
  }

  private resolveListPage(toolset: ToolsInput | undefined): ListCommentsPage | undefined {
    const tool = toolset?.[REVIEW_COMMENTS_TOOL_SLUG] as
      | { execute?: (input: unknown, context: unknown) => Promise<unknown> }
      | undefined

    if (!tool?.execute) return undefined

    return (input) => tool.execute?.(input, {}) as Promise<unknown>
  }

  private async collectLocations(
    listPage: ListCommentsPage,
    repository: string,
    pullNumber: number,
  ): Promise<Set<string>> {
    const [owner, repo] = repository.split('/')
    const locations = new Set<string>()

    for (let page = 1; page <= MAX_PAGES; page++) {
      const comments = this.readComments(
        await listPage({
          owner,
          repo,
          pull_number: pullNumber,
          per_page: PAGE_SIZE,
          page,
        }),
      )

      for (const comment of comments) {
        if (this.isCommentOnNewFile(comment)) {
          locations.add(`${comment.path}:${comment.line}`)
        }
      }

      if (comments.length < PAGE_SIZE) break
    }

    return locations
  }

  private isCommentOnNewFile(
    comment: CommentCandidate,
  ): comment is CommentCandidate & { path: string; line: number } {
    const isDeletedLine =
      typeof comment.side === 'string' && comment.side.toUpperCase() === 'LEFT'

    return (
      typeof comment.path === 'string' &&
      typeof comment.line === 'number' &&
      !isDeletedLine
    )
  }

  private readComments(response: unknown): CommentCandidate[] {
    const { successful, data } = (response ?? {}) as CommentsResponse
    const container = (data ?? {}) as { comments?: unknown; details?: unknown }
    const comments = Array.isArray(data)
      ? data
      : (container.comments ?? container.details)

    if (successful === false || !Array.isArray(comments)) {
      throw new Error('Unusable review comments response.')
    }

    return comments.filter(
      (comment): comment is CommentCandidate =>
        typeof comment === 'object' && comment !== null,
    )
  }
}
