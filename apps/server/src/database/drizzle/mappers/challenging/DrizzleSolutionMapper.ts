import { Solution } from '@stardust/core/challenging/entities'
import type {
  DrizzleSolution,
  DrizzleInsertSolution,
} from '../../types/entities/challenging'
export class DrizzleSolutionMapper {
  static toEntity(row: DrizzleSolution): Solution {
    return Solution.create({
      ...content(row),
      ...publication(row),
      ...engagement(row),
      postedAt: row.createdAt,
      author: author(row),
    })
  }
  static toPersistence(solution: Solution): DrizzleInsertSolution {
    return {
      id: solution.id.value,
      ...persistenceContent(solution),
      ...persistencePublication(solution),
      viewsCount: solution.viewsCount.value,
      createdAt: solution.postedAt,
    }
  }
}

function author(row: DrizzleSolution): Solution['dto']['author'] {
  return {
    id: row.authorId ?? row.userId,
    entity: authorProfile(row),
  }
}
function authorProfile(row: DrizzleSolution) {
  return {
    name: row.authorName ?? '',
    slug: row.authorSlug ?? '',
    avatar: { name: row.authorAvatarName ?? '', image: row.authorAvatarImage ?? '' },
  }
}
function publication(row: DrizzleSolution) {
  return { slug: row.slug, challengeId: row.challengeId }
}
function engagement(row: DrizzleSolution) {
  return {
    viewsCount: row.viewsCount,
    upvotesCount: row.upvotesCount,
    commentsCount: row.commentsCount,
  }
}
function persistencePublication(solution: Solution) {
  return {
    slug: solution.slug.value,
    challengeId: solution.challengeId.value,
    userId: solution.author.id.value,
  }
}
function content(
  row: DrizzleSolution,
): Pick<DrizzleSolution, 'id' | 'title' | 'content'> {
  return { id: row.id, title: row.title, content: row.content }
}
function persistenceContent(
  solution: Solution,
): Pick<DrizzleInsertSolution, 'title' | 'content'> {
  return { title: solution.title.value, content: solution.content.value }
}
