import {
  type Code,
  type Id,
  type Integer,
  type List,
  type Name,
  type Slug,
  type UserAnswer,
  type Text,
  Logical,
} from '#global/domain/structures/index'
import { Entity } from '#global/domain/abstracts/index'
import type { AuthorAggregate } from '#global/domain/aggregates/index'
import type { ChallengeDifficulty, TestCase } from '../structures'
import type { ChallengeCategory } from './ChallengeCategory'
import type { ChallengeVote } from '../types'
import type { ChallengeDto } from './dtos'
import { ChallengeWithoutTestCaseError, InsufficientInputsError } from '../errors'
import { ChallengeFactory } from '../factories'

export type ChallengeProps = {
  code: string
  title: Name
  slug: Slug
  difficulty: ChallengeDifficulty
  categories: ChallengeCategory[]
  downvotesCount: Integer
  upvotesCount: Integer
  completionsCount: Integer
  postedAt: Date
  starId: Id | null
  description: Text
  testCases: TestCase[]
  results: List<boolean>
  userOutputs: List<unknown>
  userVote: ChallengeVote
  incorrectAnswersCount: Integer
  isCompleted: Logical
  isPublic: Logical
  author: AuthorAggregate
}

export class Challenge extends Entity<ChallengeProps> {
  static readonly MAXIMUM_INCORRECT_ANSWERS_PER_TEST_CASE = 10

  static create(dto: ChallengeDto): Challenge {
    if (!dto.testCases.length) {
      throw new ChallengeWithoutTestCaseError()
    }
    return new Challenge(ChallengeFactory.produce(dto), dto?.id)
  }

  private formatCode(code: Code, testCase: TestCase) {
    if (code.hasFunction.isTrue) {
      return code.addFunctionCall(testCase.inputs)
    }

    if (code.inputsCount !== testCase.inputs.length) {
      throw new InsufficientInputsError()
    }

    return code.addInputs(testCase.inputs)
  }

  private verifyResult(result: unknown, testCase: TestCase, code: Code) {
    const translatedExpectedOutput = code.translateToCodeRunner(testCase.expectedOutput)
    const isCorrect = result === translatedExpectedOutput

    if (!isCorrect)
      this.props.incorrectAnswersCount = this.incorrectAnswersCount.increment()

    return isCorrect
  }

  async runCode(code: Code) {
    this.props.results = this.props.results.becomeEmpty()
    this.props.userOutputs = this.props.userOutputs.becomeEmpty()

    for (const testCase of this.testCases) {
      const formattedCode = this.formatCode(code, testCase)
      const response = await formattedCode.run()
      if (response.isFailure) response.throwError()

      let result = ''

      if (code.hasFunction.isTrue) result = response.result
      else if (response.outputs[0]) result = code.format(response.outputs[0]).value

      this.props.results = this.results.add(
        this.verifyResult(result, testCase, formattedCode),
      )
      this.props.userOutputs = this.userOutputs.add(result)
    }
  }

  verifyUserAnswer(userAnswer: UserAnswer): UserAnswer {
    const isAnswerCorrect =
      this.results.length === this.testCases.length &&
      this.results.hasAllEqualTo(true).isTrue

    if (isAnswerCorrect) {
      return userAnswer.becomeVerified().becomeCorrect()
    }

    return userAnswer.becomeVerified().becomeIncorrect()
  }

  incrementIncorrectAnswersCount() {
    this.props.incorrectAnswersCount = this.incorrectAnswersCount.increment()
  }

  private removeUpvote() {
    if (this.upvotesCount.value > 0) this.upvotesCount = this.upvotesCount.decrement()
  }

  private removeDownvote() {
    if (this.downvotesCount.value > 0)
      this.downvotesCount = this.downvotesCount.decrement()
  }

  private upvote() {
    this.upvotesCount = this.upvotesCount.increment()
    this.removeDownvote()
  }

  private downvote() {
    this.removeUpvote()
    this.downvotesCount = this.downvotesCount.increment()
  }

  vote(vote: ChallengeVote) {
    if (vote === this.userVote) {
      if (vote === 'upvote') this.removeUpvote()
      if (vote === 'downvote') this.removeDownvote()
      this.userVote = null
      return
    }
    if (vote !== this.userVote) {
      if (vote === 'upvote') this.upvote()
      if (vote === 'downvote') this.downvote()
    }
    this.userVote = vote
  }

  makeCompleted() {
    this.props.isCompleted = this.props.isCompleted.becomeTrue()
  }

  get maximumIncorrectAnswersCount() {
    const testsCasesCount = this.testCases.length
    return testsCasesCount * Challenge.MAXIMUM_INCORRECT_ANSWERS_PER_TEST_CASE
  }

  get hasAnswer() {
    return Logical.create(this.props.results.length > 0)
  }

  get results() {
    return this.props.results
  }

  get userOutputs() {
    return this.props.userOutputs
  }

  get userVote() {
    return this.props.userVote
  }

  set userVote(vote: ChallengeVote) {
    this.props.userVote = vote
  }

  get incorrectAnswersCount() {
    return this.props.incorrectAnswersCount
  }

  set categories(categories: ChallengeCategory[]) {
    this.props.categories = categories
  }

  get isFromStar(): Logical {
    return Logical.create(Boolean(this.props.starId))
  }

  get title() {
    return this.props.title
  }

  get code() {
    return this.props.code
  }

  get slug() {
    return this.props.slug
  }

  get difficulty() {
    return this.props.difficulty
  }

  get description() {
    return this.props.description
  }

  get categories() {
    return this.props.categories
  }

  get isPublic(): Logical {
    return this.props.isPublic
  }

  set isPublic(isPublic: boolean) {
    this.props.isPublic = Logical.create(isPublic)
  }

  get author() {
    return this.props.author
  }

  get upvotesCount() {
    return this.props.upvotesCount
  }

  set upvotesCount(upvotesCount: Integer) {
    this.props.upvotesCount = upvotesCount
  }

  get downvotesCount() {
    return this.props.downvotesCount
  }

  set downvotesCount(downvotesCount: Integer) {
    this.props.downvotesCount = downvotesCount
  }

  get completionsCount() {
    return this.props.completionsCount
  }

  get testCases() {
    return this.props.testCases
  }

  get starId() {
    return this.props.starId
  }

  get isCompleted() {
    return this.props.isCompleted
  }

  get postedAt() {
    return this.props.postedAt
  }

  get dto(): ChallengeDto {
    return {
      id: this.id.value,
      title: this.title.value,
      code: this.code,
      slug: this.slug.value,
      difficultyLevel: this.difficulty.level,
      author: this.props.author.dto,
      downvotesCount: this.downvotesCount.value,
      starId: this.props.starId?.value,
      upvotesCount: this.upvotesCount.value,
      completionsCount: this.completionsCount.value,
      isPublic: this.isPublic.value,
      userOutputs: this.props.userOutputs.items,
      results: this.props.results.items,
      description: this.description.value,
      postedAt: this.postedAt,
      categories: this.categories.map((category) => category.dto),
      testCases: this.testCases.map((testCase) => testCase.dto),
    }
  }
}
