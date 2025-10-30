import { Quiz } from '../Quiz'
import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '../../entities'
import {
  CheckboxQuestionsFaker,
  DragAndDropListQuestionsFaker,
  DragAndDropQuestionsFaker,
  OpenQuestionsFaker,
  SelectionQuestionsFaker,
} from '../../entities/fakers'
import type {
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '../../entities/dtos'

describe('Quiz Structure', () => {
  const makeSelectionQuestionDto = (
    overrides: Partial<SelectionQuestionDto> = {},
  ): SelectionQuestionDto =>
    SelectionQuestionsFaker.fakeDto({
      stem: 'Which option is correct?',
      picture: 'selection.png',
      answer: 'Correct Option',
      options: ['Correct Option', 'Wrong Option'],
      ...overrides,
    })

  const makeCheckboxQuestionDto = (
    overrides: Partial<CheckboxQuestionDto> = {},
  ): CheckboxQuestionDto =>
    CheckboxQuestionsFaker.fakeDto({
      stem: 'Select all correct options',
      picture: 'checkbox.png',
      options: ['A', 'B', 'C'],
      correctOptions: ['A', 'C'],
      ...overrides,
    })

  const makeOpenQuestionDto = (
    overrides: Partial<OpenQuestionDto> = {},
  ): OpenQuestionDto =>
    OpenQuestionsFaker.fakeDto({
      stem: 'Provide the missing pieces',
      picture: 'open.png',
      answers: ['first answer'],
      lines: [
        {
          number: 1,
          texts: ['input-1'],
          indentation: 0,
        },
      ],
      ...overrides,
    })

  const makeDragAndDropListQuestionDto = (
    overrides: Partial<DragAndDropListQuestionDto> = {},
  ): DragAndDropListQuestionDto =>
    DragAndDropListQuestionsFaker.fakeDto({
      stem: 'Reorder the steps',
      picture: 'drag-and-drop-list.png',
      items: [
        { position: 1, label: 'first' },
        { position: 2, label: 'second' },
      ],
      ...overrides,
    })

  const makeDragAndDropQuestionDto = (
    overrides: Partial<DragAndDropQuestionDto> = {},
  ): DragAndDropQuestionDto =>
    DragAndDropQuestionsFaker.fakeDto({
      stem: 'Complete the code',
      picture: 'drag-and-drop.png',
      lines: [
        {
          number: 1,
          texts: ['const value =', 'dropZone'],
          indentation: 0,
        },
      ],
      items: [
        { index: 1, label: 'value' },
        { index: 2, label: 'spare' },
      ],
      correctItems: ['value'],
      ...overrides,
    })

  const buildFullQuiz = () =>
    Quiz.create([
      makeSelectionQuestionDto(),
      makeCheckboxQuestionDto(),
      makeOpenQuestionDto(),
      makeDragAndDropListQuestionDto(),
      makeDragAndDropQuestionDto(),
    ])

  it('should create quiz with default values and map question types', () => {
    const quiz = buildFullQuiz()

    expect(quiz.livesCount.value).toBe(5)
    expect(quiz.currentQuestionIndex.value).toBe(0)
    expect(quiz.incorrectAnswersCount.value).toBe(0)
    expect(quiz.hasAlreadyIncrementIncorrectAnswersCount.isFalse).toBeTruthy()
    expect(quiz.userAnswer.value).toBeNull()

    expect(quiz.questions).toHaveLength(5)
    expect(quiz.questions[0]).toBeInstanceOf(SelectionQuestion)
    expect(quiz.questions[1]).toBeInstanceOf(CheckboxQuestion)
    expect(quiz.questions[2]).toBeInstanceOf(OpenQuestion)
    expect(quiz.questions[3]).toBeInstanceOf(DragAndDropListQuestion)
    expect(quiz.questions[4]).toBeInstanceOf(DragAndDropQuestion)

    expect(quiz.currentQuestion).toBeInstanceOf(SelectionQuestion)
    expect(quiz.questionsCount).toBe(5)
    expect(quiz.progress).toBe(0)
    expect(quiz.hasLives).toBe(true)
    expect(quiz.hasNextQuestion.isTrue).toBeTruthy()
  })

  it('should update user answer value', () => {
    const quiz = Quiz.create([makeSelectionQuestionDto()])

    const updatedQuiz = quiz.changeUserAnswer('Correct Option')

    expect(updatedQuiz.userAnswer.value).toBe('Correct Option')
    expect(quiz.userAnswer.value).toBeNull()
  })

  it('should verify a correct answer and mark it as verified on first check', () => {
    const quiz = Quiz.create([makeSelectionQuestionDto()])
    const answeredQuiz = quiz.changeUserAnswer('Correct Option')

    const result = answeredQuiz.verifyUserAnswer()

    expect(result.userAnswer.isCorrect.isTrue).toBeTruthy()
    expect(result.userAnswer.isVerified.isTrue).toBeTruthy()
    expect(result.livesCount.value).toBe(5)
    expect(result.currentQuestionIndex.value).toBe(0)
  })

  it('should advance to the next question after confirming a correct answer twice', () => {
    const quiz = Quiz.create([
      makeSelectionQuestionDto(),
      makeSelectionQuestionDto({
        answer: 'Another Option',
        options: ['Another Option', 'Correct Option'],
      }),
    ])

    const firstAttempt = quiz.changeUserAnswer('Correct Option').verifyUserAnswer()
    const secondAttempt = firstAttempt.verifyUserAnswer()

    expect(secondAttempt.currentQuestionIndex.value).toBe(1)
    expect(secondAttempt.userAnswer.value).toBeNull()
    expect(secondAttempt.userAnswer.isVerified.isFalse).toBeTruthy()
    expect(secondAttempt.progress).toBe(0.5)
  })

  it('should mark answer as incorrect without losing a life on the first wrong attempt', () => {
    const quiz = Quiz.create([makeSelectionQuestionDto()])
    const firstAttempt = quiz.changeUserAnswer('Wrong Option')

    const result = firstAttempt.verifyUserAnswer()

    expect(result.userAnswer.isCorrect.isFalse).toBeTruthy()
    expect(result.userAnswer.isVerified.isTrue).toBeTruthy()
    expect(result.livesCount.value).toBe(5)
    expect(result.incorrectAnswersCount.value).toBe(0)
    expect(result.hasAlreadyIncrementIncorrectAnswersCount.isFalse).toBeTruthy()
  })

  it('should decrement lives and increment incorrect answers on repeated wrong attempts', () => {
    const quiz = Quiz.create([makeSelectionQuestionDto()])
    const firstAttempt = quiz.changeUserAnswer('Wrong Option').verifyUserAnswer()

    const secondAttempt = firstAttempt.verifyUserAnswer()

    expect(secondAttempt.livesCount.value).toBe(4)
    expect(secondAttempt.incorrectAnswersCount.value).toBe(1)
    expect(secondAttempt.hasAlreadyIncrementIncorrectAnswersCount.isTrue).toBeTruthy()
    expect(secondAttempt.userAnswer.isVerified.isFalse).toBeTruthy()

    const thirdAttempt = secondAttempt.verifyUserAnswer()

    expect(thirdAttempt.livesCount.value).toBe(4)
    expect(thirdAttempt.incorrectAnswersCount.value).toBe(1)
    expect(thirdAttempt.userAnswer.isVerified.isTrue).toBeTruthy()
  })

  it('should return the same quiz instance when there is no current question', () => {
    const quiz = Quiz.create([])

    const result = quiz.verifyUserAnswer()

    expect(result).toBe(quiz)
    expect(result.currentQuestion).toBeNull()
    expect(result.hasNextQuestion.isFalse).toBeTruthy()
  })
})
