import { NotFoundError } from '#global/errors'
import { Integer, Logical } from '#global/structs'
import type { Question } from '#lesson/abstracts'
import type { QuestionDto } from '#lesson/dtos'
import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '#lesson/entities'
import { QuestionAnswer } from './QuestionAnswer'

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

  static create(questionsDto: QuestionDto[]): Quiz {
    const questions: Question[] = []

    for (const questionDto of questionsDto) {
      if (SelectionQuestion.canBeCreatedBy(questionDto)) {
        questions.push(SelectionQuestion.create(questionDto))
        continue
      }

      if (CheckboxQuestion.canBeCreatedBy(questionDto)) {
        questions.push(CheckboxQuestion.create(questionDto))
        continue
      }

      if (OpenQuestion.canBeCreatedBy(questionDto)) {
        questions.push(OpenQuestion.create(questionDto))
        continue
      }

      if (DragAndDropListQuestion.canBeCreatedBy(questionDto)) {
        questions.push(DragAndDropListQuestion.create(questionDto))
        continue
      }

      if (DragAndDropQuestion.canBeCreatedBy(questionDto)) {
        questions.push(DragAndDropQuestion.create(questionDto))
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
    const currentQuestion = this.questions[this.currentQuestionIndex.value]
    if (!currentQuestion) throw new NotFoundError('Current question not found')
    return currentQuestion
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

  get hasNextQuestion() {
    return this.currentQuestionIndex.value < this.questionsCount
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
