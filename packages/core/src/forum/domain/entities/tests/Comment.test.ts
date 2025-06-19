import { Text } from '#global/domain/structures/Text'
import { CommentsFaker } from '../fakers/CommentsFaker'

describe('Comment Entity', () => {
  it('should increment upvotes count when upvoted', () => {
    const comment = CommentsFaker.fake({ upvotesCount: 0 })

    expect(comment.upvotesCount.value).toBe(0)

    comment.upvote()

    expect(comment.upvotesCount.value).toBe(1)
  })

  it('should decrement upvotes count when removed upvote', () => {
    const comment = CommentsFaker.fake({ upvotesCount: 1 })

    expect(comment.upvotesCount.value).toBe(1)

    comment.removeUpvote()

    expect(comment.upvotesCount.value).toBe(0)
  })

  it('should set content', () => {
    const oldContent = Text.create('content 1')
    const comment = CommentsFaker.fake({ content: oldContent.value })
    const newContent = Text.create('content 2')

    expect(comment.content).toEqual(oldContent)

    comment.content = newContent

    expect(comment.content).toEqual(newContent)
  })
})
