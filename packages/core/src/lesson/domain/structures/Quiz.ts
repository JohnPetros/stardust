import { NotFoundError } from '../../../global/domain/errors'
import { Integer, Logical, UserAnswer } from '../../../global/domain/structures'
import type { Question } from '../abstracts'
import type { QuestionDto } from '../entities/dtos'
import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '../entities'

type QuizProps = {
  livesCount: Integer
  currentQuestionIndex: Integer
  incorrectAnswersCount: Integer
  questions: Question[]
  userAnswer: UserAnswer
  hasAlreadyIncrementIncorrectAnswersCount: Logical
}

export class Quiz {
  readonly livesCount: Integer
  readonly currentQuestionIndex: Integer
  readonly incorrectAnswersCount: Integer
  readonly questions: Question[]
  readonly userAnswer: UserAnswer
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
      livesCount: Integer.create(5, 'Contagem de vidas'),
      currentQuestionIndex: Integer.create(0, 'Índice da questão atual'),
      incorrectAnswersCount: Integer.create(0, 'Contagem de respostas incorreta'),
      userAnswer: UserAnswer.create(),
      hasAlreadyIncrementIncorrectAnswersCount: Logical.create(
        false,
        'O número de respostas incorretas foi incrementado',
      ),
      questions,
    })
  }

  changeUserAnswer(answerValue: unknown): Quiz {
    return this.clone({ userAnswer: this.userAnswer.changeAnswerValue(answerValue) })
  }

  verifyUserAnswer(): Quiz {
    const isUserAnswerCorrect = this.currentQuestion?.verifyUserAnswer(this.userAnswer)
    if (!isUserAnswerCorrect) return this

    const oldUserAnswer = this.userAnswer
    let newUserAnswer = oldUserAnswer.becomeVerified()

    if (isUserAnswerCorrect.isTrue) {
      newUserAnswer = newUserAnswer.becomeCorrect()

      if (oldUserAnswer.isVerified.isTrue) {
        return this.nextQuestion()
      }

      return this.clone({ userAnswer: newUserAnswer })
    }

    newUserAnswer = newUserAnswer.becomeIncorrect()

    if (oldUserAnswer.isVerified.isTrue) {
      return this.decrementLivesCount(newUserAnswer)
    }

    return this.clone({ userAnswer: newUserAnswer })
  }

  nextQuestion(): Quiz {
    return this.clone({
      currentQuestionIndex: this.currentQuestionIndex.increment(),
      userAnswer: UserAnswer.create(null),
    })
  }

  incrementIncorrectAnswersCount() {
    if (this.hasAlreadyIncrementIncorrectAnswersCount.isFalse)
      return {
        incorrectAnswersCount: this.incorrectAnswersCount.increment(),
        hasAlreadyIncrementIncorrectAnswersCount:
          this.hasAlreadyIncrementIncorrectAnswersCount.invertValue(),
      }
  }

  decrementLivesCount(userAnswer: UserAnswer): Quiz {
    return this.clone({
      userAnswer,
      livesCount: this.livesCount.decrement(),
      ...this.incrementIncorrectAnswersCount(),
    })
  }

  get currentQuestion() {
    const currentQuestion = this.questions[this.currentQuestionIndex.value]
    return currentQuestion ?? null
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
    return Logical.create(this.currentQuestionIndex.value < this.questionsCount)
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
