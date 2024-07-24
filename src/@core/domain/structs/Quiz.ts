import type { QuestionDTO } from '@/@core/dtos'
import type { Question } from '../abstracts'
import { Integer } from './Integer'
import { SelectionQuestion } from '../entities/SelectionQuestion'

type QuizProps = {
  livesCount: Integer
  currentQuestionIndex: Integer
  incorrectAnswersCount: Integer
  questions: Question[]
}

export class Quiz {
  readonly livesCount: Integer
  readonly currentQuestionIndex: Integer
  readonly incorrectAnswersCount: Integer
  readonly questions: Question[]

  private constructor(props: QuizProps) {
    this.livesCount = props.livesCount
    this.currentQuestionIndex = props.currentQuestionIndex
    this.incorrectAnswersCount = props.incorrectAnswersCount
    this.questions = props.questions
  }

  static create(questionsDTO: QuestionDTO[]): Quiz {
    const questions: Question[] = []

    for (const questionDTO of questionsDTO) {
      if (SelectionQuestion.canBeCreatedBy(questionDTO))
        questions.push(SelectionQuestion.create(questionDTO))
    }

    return new Quiz({
      livesCount: Integer.create('Quiz lives count', 5),
      currentQuestionIndex: Integer.create('Quiz current question index', 0),
      incorrectAnswersCount: Integer.create('Quiz incorrect answers count', 0),
      questions,
    })
  }

  get progress() {
    return this.currentQuestionIndex.value / this.questions.length
  }

  get questionsCount() {
    return this.questions.length
  }
}
