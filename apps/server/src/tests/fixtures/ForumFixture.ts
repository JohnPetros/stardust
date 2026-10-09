import type { SupabaseClient } from '@supabase/supabase-js'
import { sql, type SQL } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { challengeModel, solutionModel } from '@/database/drizzle/models/challenging'
import {
  commentModel,
  challengeCommentModel,
  solutionCommentModel,
} from '@/database/drizzle/models/forum'

import type { ChallengeDto, SolutionDto } from '@stardust/core/challenging/entities/dtos'
import {
  ChallengesFaker,
  SolutionsFaker,
} from '@stardust/core/challenging/entities/fakers'
import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import { CommentsFaker } from '@stardust/core/forum/entities/fakers'

export type ForumCommentSnapshot = {
  id: string
  content: string
  parentCommentId: string | null
  upvotesCount: number
  repliesCount: number
  author: {
    id: string
    entity: {
      name: string
      slug: string
      avatar: {
        name: string
        image: string
      }
    }
  }
}

type CreateCommentInput = {
  authorId: string
  content?: string
}

type CreateReplyInput = CreateCommentInput & {
  commentId: string
}

export class ForumFixture {
  private readonly database = DrizzleClient.getInstance()

  constructor(_supabase: SupabaseClient) {}

  async createChallenge(
    authorId: string,
    baseDto?: Partial<ChallengeDto>,
  ): Promise<ChallengeDto> {
    const challenge = ChallengesFaker.fakeDto({
      categories: [],
      starId: null,
      isPublic: true,
      isNew: false,
      ...baseDto,
    })
    const challengeSlug = challenge.slug
    if (challengeSlug === undefined) throw new Error('Challenge fixture requires a slug')
    challenge.author = {
      ...challenge.author,
      id: authorId,
    }

    await this.database.insert(challengeModel).values({
      id: challenge.id,
      title: challenge.title,
      difficultyLevel: challenge.difficultyLevel,
      initialCode: challenge.initialCode,
      description: challenge.description,
      slug: challengeSlug,
      userId: authorId,
      starId: challenge.starId,
      isPublic: challenge.isPublic ?? false,
      testCases: challenge.testCases,
    })

    return challenge
  }

  async createSolution(
    authorId: string,
    baseDto?: Partial<SolutionDto>,
  ): Promise<SolutionDto> {
    const challengeId =
      baseDto?.challengeId ?? (await this.createChallenge(authorId)).id ?? ''

    const solution = SolutionsFaker.fakeDto({
      challengeId,
      ...baseDto,
    })
    const solutionSlug = solution.slug
    if (solutionSlug === undefined) throw new Error('Solution fixture requires a slug')
    solution.author = {
      ...solution.author,
      id: authorId,
    }

    await this.database.insert(solutionModel).values({
      id: solution.id,
      title: solution.title,
      content: solution.content,
      slug: solutionSlug,
      userId: authorId,
      challengeId: solution.challengeId,
      viewsCount: solution.viewsCount ?? 0,
    })

    return solution
  }

  async createChallengeComment(
    challengeId: string,
    input: CreateCommentInput,
  ): Promise<ForumCommentSnapshot> {
    const comment = CommentsFaker.fakeDto(
      input.content ? { content: input.content } : undefined,
    )
    comment.author = {
      ...comment.author,
      id: input.authorId,
    }

    await this.insertComment(comment)

    await this.database.insert(challengeCommentModel).values({
      challengeId,
      commentId: comment.id ?? '',
    })

    return this.getRequiredCommentById(comment.id ?? '')
  }

  async createSolutionComment(
    solutionId: string,
    input: CreateCommentInput,
  ): Promise<ForumCommentSnapshot> {
    const comment = CommentsFaker.fakeDto(
      input.content ? { content: input.content } : undefined,
    )
    comment.author = {
      ...comment.author,
      id: input.authorId,
    }

    await this.insertComment(comment)

    await this.database.insert(solutionCommentModel).values({
      solutionId,
      commentId: comment.id ?? '',
    })

    return this.getRequiredCommentById(comment.id ?? '')
  }

  async createReply(input: CreateReplyInput): Promise<ForumCommentSnapshot> {
    const reply = CommentsFaker.fakeDto(
      input.content ? { content: input.content } : undefined,
    )
    reply.author = {
      ...reply.author,
      id: input.authorId,
    }

    await this.database.insert(commentModel).values({
      id: reply.id,
      content: reply.content,
      userId: reply.author.id,
      parentCommentId: input.commentId,
    })

    return this.getRequiredCommentById(reply.id ?? '')
  }

  async findCommentById(commentId: string): Promise<ForumCommentSnapshot | null> {
    const comments = await this.selectComments(sql`c.id = ${commentId}`)
    return comments[0] ?? null
  }

  async listChallengeComments(challengeId: string): Promise<ForumCommentSnapshot[]> {
    return this.selectComments(sql`c.parent_comment_id is null and exists (
      select 1 from public.challenges_comments cc
      where cc.comment_id = c.id and cc.challenge_id = ${challengeId}
    )`)
  }

  async listSolutionComments(solutionId: string): Promise<ForumCommentSnapshot[]> {
    return this.selectComments(sql`c.parent_comment_id is null and exists (
      select 1 from public.solutions_comments sc
      where sc.comment_id = c.id and sc.solution_id = ${solutionId}
    )`)
  }

  async listReplies(commentId: string): Promise<ForumCommentSnapshot[]> {
    return this.selectComments(sql`c.parent_comment_id = ${commentId}`)
  }

  private async selectComments(condition: SQL): Promise<ForumCommentSnapshot[]> {
    const comments = await this.database.execute<{
      id: string
      content: string
      parent_comment_id: string | null
      upvotes_count: number | string
      replies_count: number | string
      author_id: string
      author_name: string
      author_slug: string
      author_avatar_name: string
      author_avatar_image: string
    }>(sql`select c.id, c.content, c.parent_comment_id, c.upvotes_count,
      c.replies_count, c.author_id, c.author_name, c.author_slug,
      c.author_avatar_name, c.author_avatar_image
      from public.comments_view c where ${condition} order by c.created_at desc`)
    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      parentCommentId: comment.parent_comment_id,
      upvotesCount: Number(comment.upvotes_count ?? 0),
      repliesCount: Number(comment.replies_count ?? 0),
      author: {
        id: comment.author_id,
        entity: {
          name: comment.author_name,
          slug: comment.author_slug,
          avatar: {
            name: comment.author_avatar_name,
            image: comment.author_avatar_image,
          },
        },
      },
    }))
  }

  private async insertComment(comment: CommentDto): Promise<void> {
    await this.database.insert(commentModel).values({
      id: comment.id,
      content: comment.content,
      userId: comment.author.id,
      parentCommentId: null,
    })
  }

  private async getRequiredCommentById(commentId: string): Promise<ForumCommentSnapshot> {
    const comment = await this.findCommentById(commentId)

    if (!comment) {
      throw new Error(`Expected comment ${commentId} to exist`)
    }

    return comment
  }
}
