import type { Quiz } from './Quiz'
import type { Story } from './Story'

type LessonProgressProps = {
  story: Story
  quiz: Quiz
}

export class LessonProgress {
  readonly story: Story
  readonly quiz: Quiz

  constructor(props: LessonProgressProps) {
    this.story = props.story
    this.quiz = props.quiz
  }

  static create(story: Story, quiz: Quiz) {
    return new LessonProgress({ quiz, story })
  }

  get value(): number {
    const total = this.story.chunksCount + this.quiz.questionsCount
    if (total === 0) return 0

    const half = total / 2

    const progress =
      (this.story.progress * half) / total + (this.quiz.progress * half) / total

    return progress * 100
  }
}
