import { Logical } from './Logical'
import type { Quiz } from './Quiz'
import type { Theory } from './Theory'

type LessonProgressProps = {
  theory: Theory
  quiz: Quiz
}

export class LessonProgress {
  readonly theory: Theory
  readonly quiz: Quiz

  constructor(props: LessonProgressProps) {
    this.theory = props.theory
    this.quiz = props.quiz
  }

  static create(theory: Theory, quiz: Quiz) {
    return new LessonProgress({ quiz, theory })
  }

  get value() {
    const total = this.theory.textsBlockCount + this.quiz.questionsCount
    if (total === 0) return 0

    const half = total / 2

    const progress =
      (this.theory.progress * half) / total + (this.quiz.progress * half) / total

    return progress * 100
  }

  get isFull() {
    return Logical.create('Is lesson progress full?', this.value === 100)
  }
}
