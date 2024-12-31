import { Entity } from '#global/abstracts'
import {
  type Code,
  type Id,
  type Integer,
  type List,
  type Name,
  type Slug,
  type TextBlock,
  type UserAnswer,
  Logical,
} from '#global/structs'
import type { ChallengeDifficulty, TestCase } from '#challenging/structs'
import type { ChallengeDto } from '#challenging/dtos'
import type { ChallengeCategory } from './ChallengeCategory'
import { InsufficientInputsError } from '#challenging/errors'
import { ChallengeFactory } from '#challenging/factories'
import type { ChallengeVote } from '#challenging/types'

export type ChallengeProps = {
  code: string
  title: Name
  slug: Slug
  difficulty: ChallengeDifficulty
  categories: ChallengeCategory[]
  authorSlug: Slug
  functionName: Name | null
  downvotesCount: Integer
  upvotesCount: Integer
  completionsCount: Integer
  createdAt: Date
  starId: Id | null
  docId: Id | null
  textBlocks: TextBlock[]
  description: string
  testCases: TestCase[]
  results: List<boolean>
  userOutputs: List<unknown>
  userVote: ChallengeVote
  incorrectAnswersCount: Integer
  isCompleted: Logical
}

export class Challenge extends Entity<ChallengeProps> {
  static create(dto: ChallengeDto): Challenge {
    return new Challenge(ChallengeFactory.produce(dto), dto?.id)
  }

  private formatCode(code: Code, testCase: TestCase) {
    if (code.inputsCount !== testCase.inputs.length) {
      throw new InsufficientInputsError()
    }

    if (this.props.functionName) {
      return code.addFunction(this.props.functionName.value, testCase.inputs)
    }

    return code.addInputs(testCase.inputs)
  }

  private verifyResult(result: unknown, testCase: TestCase, code: Code) {
    if (this.hasFunction) return result === testCase.expectedOutput

    return result === testCase.expectedOutput
  }

  async runCode(code: Code) {
    for (const testCase of this.testCases) {
      const formattedCode = this.formatCode(code, testCase)
      const response = await formattedCode.run()

      if (response.isFailure) response.throwError()

      let result = this.hasFunction.isTrue ? response.result : response.outputs[0]

      if (this.hasFunction.isTrue) result = response.result
      else if (response.outputs[0]) result = response.outputs[0]

      this.results.add(this.verifyResult(response.outputs[0], testCase, formattedCode))
      this.userOutputs.add(result)
    }
  }

  verifyUserAnswer(userAnswer: UserAnswer): UserAnswer {
    const newUserAnswer = userAnswer.makeVerified()

    const isAnswerCorrect =
      this.results.length === this.testCases.length && this.results.hasAllEqualTo(true)

    if (isAnswerCorrect) {
      this.props.isCompleted = this.props.isCompleted.makeTrue()
      return newUserAnswer.makeCorrect()
    }

    return newUserAnswer.makeIncorrect()
  }

  incrementIncorrectAnswersCount() {
    this.props.incorrectAnswersCount = this.incorrectAnswersCount.increment(1)
  }

  private removeUpvote() {
    if (this.upvotesCount.value > 0) this.upvotesCount = this.upvotesCount.dencrement(1)
  }

  private removeDownvote() {
    if (this.downvotesCount.value > 0)
      this.downvotesCount = this.downvotesCount.dencrement(1)
  }

  private upvote() {
    this.upvotesCount = this.upvotesCount.increment(1)
    this.removeDownvote()
  }

  private downvote() {
    this.removeUpvote()
    this.downvotesCount = this.downvotesCount.increment(1)
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

  private get hasFunction() {
    return Logical.create('Esse desafio tem função?', Boolean(this.props.functionName))
  }

  get isCompleted() {
    return this.props.isCompleted
  }

  get hasAnswer() {
    return Logical.create('Há resposta para o desafio?', this.props.results.length > 0)
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
    return Logical.create(
      'Esse desafio pertence a uma estrela?',
      Boolean(this.props.starId),
    )
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

  get textBlocks() {
    return this.props.textBlocks
  }

  get categories() {
    return this.props.categories
  }

  get authorSlug() {
    return this.props.authorSlug
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

  get docId() {
    return this.props.docId
  }

  get starId() {
    return this.props.starId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get dto(): ChallengeDto {
    return {
      id: this.id,
      title: this.title.value,
      code: this.code,
      slug: this.slug.value,
      difficulty: this.difficulty.level,
      docId: this.props.docId?.value,
      authorSlug: this.authorSlug.value,
      downvotesCount: this.downvotesCount.value,
      upvotesCount: this.upvotesCount.value,
      completionsCount: this.completionsCount.value,
      categories: this.categories.map((category) => category.dto),
      testCases: this.testCases.map((testCase) => testCase.dto),
      description: this.description,
      createdAt: this.createdAt,
      textBlocks: this.textBlocks.map((textBlock) => textBlock.dto),
    }
  }
}
