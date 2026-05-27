import type { SupabaseClient } from '@supabase/supabase-js'

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
  constructor(private readonly supabase: SupabaseClient) {}

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
    challenge.author = {
      ...challenge.author,
      id: authorId,
    }

    const { error } = await this.supabase.from('challenges').insert({
      id: challenge.id,
      title: challenge.title,
      difficulty_level: challenge.difficultyLevel,
      code: challenge.code,
      description: challenge.description,
      slug: challenge.slug,
      user_id: challenge.author.id,
      star_id: challenge.starId,
      is_public: challenge.isPublic ?? false,
      test_cases: challenge.testCases,
    })

    if (error) {
      throw error
    }

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
    solution.author = {
      ...solution.author,
      id: authorId,
    }

    const { error } = await this.supabase.from('solutions').insert({
      id: solution.id,
      title: solution.title,
      content: solution.content,
      slug: solution.slug,
      user_id: solution.author.id,
      challenge_id: solution.challengeId,
      views_count: solution.viewsCount ?? 0,
    })

    if (error) {
      throw error
    }

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

    const { error } = await this.supabase.from('challenges_comments').insert({
      challenge_id: challengeId,
      comment_id: comment.id,
    })

    if (error) {
      throw error
    }

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

    const { error } = await this.supabase.from('solutions_comments').insert({
      solution_id: solutionId,
      comment_id: comment.id,
    })

    if (error) {
      throw error
    }

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

    const { error } = await this.supabase.from('comments').insert({
      id: reply.id,
      content: reply.content,
      user_id: reply.author.id,
      parent_comment_id: input.commentId,
    })

    if (error) {
      throw error
    }

    return this.getRequiredCommentById(reply.id ?? '')
  }

  async findCommentById(commentId: string): Promise<ForumCommentSnapshot | null> {
    const { data, error } = await this.supabase
      .from('comments_view')
      .select(
        'id, content, parent_comment_id, upvotes_count, replies_count, author_id, author_name, author_slug, author_avatar_name, author_avatar_image',
      )
      .eq('id', commentId)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      content: data.content,
      parentCommentId: data.parent_comment_id,
      upvotesCount: Number(data.upvotes_count ?? 0),
      repliesCount: Number(data.replies_count ?? 0),
      author: {
        id: data.author_id,
        entity: {
          name: data.author_name,
          slug: data.author_slug,
          avatar: {
            name: data.author_avatar_name,
            image: data.author_avatar_image,
          },
        },
      },
    }
  }

  async listChallengeComments(challengeId: string): Promise<ForumCommentSnapshot[]> {
    const { data, error } = await this.supabase
      .from('comments_view')
      .select(
        'id, content, parent_comment_id, upvotes_count, replies_count, author_id, author_name, author_slug, author_avatar_name, author_avatar_image, challenges_comments!inner(challenge_id)',
      )
      .eq('challenges_comments.challenge_id', challengeId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data.map((comment) => ({
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

  async listSolutionComments(solutionId: string): Promise<ForumCommentSnapshot[]> {
    const { data, error } = await this.supabase
      .from('comments_view')
      .select(
        'id, content, parent_comment_id, upvotes_count, replies_count, author_id, author_name, author_slug, author_avatar_name, author_avatar_image, solutions_comments!inner(solution_id)',
      )
      .eq('solutions_comments.solution_id', solutionId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data.map((comment) => ({
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

  async listReplies(commentId: string): Promise<ForumCommentSnapshot[]> {
    const { data, error } = await this.supabase
      .from('comments_view')
      .select(
        'id, content, parent_comment_id, upvotes_count, replies_count, author_id, author_name, author_slug, author_avatar_name, author_avatar_image',
      )
      .eq('parent_comment_id', commentId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data.map((comment) => ({
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
    const { error } = await this.supabase.from('comments').insert({
      id: comment.id,
      content: comment.content,
      user_id: comment.author.id,
      parent_comment_id: null,
    })

    if (error) {
      throw error
    }
  }

  private async getRequiredCommentById(commentId: string): Promise<ForumCommentSnapshot> {
    const comment = await this.findCommentById(commentId)

    if (!comment) {
      throw new Error(`Expected comment ${commentId} to exist`)
    }

    return comment
  }
}
