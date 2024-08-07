import type { QuestionDTO } from '@/@core/dtos'
import type { Question } from '../abstracts'
import { Integer } from './Integer'
import { SelectionQuestion } from '../entities/SelectionQuestion'
import { QuestionAnswer } from './QuestionAnswer'
import { Logical } from './Logical'
import { DragAndDropListQuestion, DragAndDropQuestion, OpenQuestion } from '../entities'

type QuizProps = {
  livesCount: Integer
  currentQuestionIndex: Integer
  incorrectAnswersCount: Integer
  questions: Question[]
  userAnswer: QuestionAnswer
  hasAlreadyIncrementIncorrectAnswersCount: Logical
}

export class Quiz {
  readonly livesCount: Integer
  readonly currentQuestionIndex: Integer
  readonly incorrectAnswersCount: Integer
  readonly questions: Question[]
  readonly userAnswer: QuestionAnswer
  readonly hasAlreadyIncrementIncorrectAnswersCount: Logical

  private constructor(props: QuizProps) {
    this.livesCount = props.livesCount
    this.currentQuestionIndex = props.currentQuestionIndex
    this.incorrectAnswersCount = props.incorrectAnswersCount
    this.questions = props.questions
    this.userAnswer = props.userAnswer
    this.hasAlreadyIncrementIncorrectAnswersCount =
      props.hasAlreadyIncrementIncorrectAnswersCount
  }

  static create(questionsDTO: QuestionDTO[]): Quiz {
    const questions: Question[] = []

    for (const questionDTO of questionsDTO) {
      if (SelectionQuestion.canBeCreatedBy(questionDTO)) {
        questions.push(SelectionQuestion.create(questionDTO))
        continue
      }

      if (OpenQuestion.canBeCreatedBy(questionDTO)) {
        questions.push(OpenQuestion.create(questionDTO))
        continue
      }

      if (DragAndDropListQuestion.canBeCreatedBy(questionDTO)) {
        questions.push(DragAndDropListQuestion.create(questionDTO))
      }

      if (DragAndDropQuestion.canBeCreatedBy(questionDTO)) {
        questions.push(DragAndDropQuestion.create(questionDTO))
      }
    }

    return new Quiz({
      livesCount: Integer.create('Quiz lives count', 5),
      currentQuestionIndex: Integer.create('Quiz current question index', 0),
      incorrectAnswersCount: Integer.create('Quiz incorrect answers count', 0),
      userAnswer: QuestionAnswer.create(),
      hasAlreadyIncrementIncorrectAnswersCount: Logical.create(
        'Is quiz has already increment incorrect answers count?',
        false,
      ),
      questions,
    })
  }

  changeUserAnswer(answerValue: unknown): Quiz {
    return this.clone({ userAnswer: this.userAnswer.changeAnswerValue(answerValue) })
  }

  verifyUserAnswer(): Quiz {
    const isUserAnswerCorrect = this.currentQuestion.verifyUserAnswer(this.userAnswer)

    const oldUserAnswer = this.userAnswer
    let newUserAnswer = oldUserAnswer.makeVerified()

    if (isUserAnswerCorrect.isTrue) {
      newUserAnswer = newUserAnswer.makeCorrect()

      if (oldUserAnswer.isVerified.isTrue) {
        return this.nextQuestion()
      }

      return this.clone({ userAnswer: newUserAnswer })
    }

    newUserAnswer = newUserAnswer.makeIncorrect()

    if (oldUserAnswer.isVerified.isTrue) {
      return this.decrementLivesCount(newUserAnswer)
    }

    return this.clone({ userAnswer: newUserAnswer })
  }

  nextQuestion(): Quiz {
    return this.clone({
      currentQuestionIndex: this.currentQuestionIndex.increment(1),
      userAnswer: QuestionAnswer.create(null),
    })
  }

  incrementIncorrectAnswersCount() {
    if (this.hasAlreadyIncrementIncorrectAnswersCount.isFalse)
      return {
        incorrectAnswersCount: this.incorrectAnswersCount.increment(1),
        hasAlreadyIncrementIncorrectAnswersCount:
          this.hasAlreadyIncrementIncorrectAnswersCount.invertValue(),
      }
  }

  decrementLivesCount(userAnswer: QuestionAnswer): Quiz {
    return this.clone({
      userAnswer,
      livesCount: this.livesCount.dencrement(1),
      ...this.incrementIncorrectAnswersCount(),
    })
  }

  get currentQuestion() {
    console.log('questions', this.questions)
    return this.questions[this.currentQuestionIndex.value]
  }

  get progress() {
    return this.currentQuestionIndex.value / this.questions.length
  }

  get questionsCount() {
    return this.questions.length
  }

  get hasLives() {
    return this.livesCount.value > 0
  }

  private clone(props?: Partial<QuizProps>) {
    return new Quiz({
      livesCount: this.livesCount,
      currentQuestionIndex: this.currentQuestionIndex,
      incorrectAnswersCount: this.incorrectAnswersCount,
      questions: this.questions,
      userAnswer: this.userAnswer,
      hasAlreadyIncrementIncorrectAnswersCount:
        this.hasAlreadyIncrementIncorrectAnswersCount,
      ...props,
    })
  }
}
