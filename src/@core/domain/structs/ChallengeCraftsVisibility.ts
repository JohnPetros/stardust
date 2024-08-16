import { Logical } from './Logical'

type ChallengesCraftVisilibityDTO = {
  canShowSolutions: boolean
  canShowComments: boolean
}

type ChallengesCraftVisilibityProps = {
  canShowSolutions: Logical
  canShowComments: Logical
}

export class ChallengesCraftVisilibity {
  static readonly solutionsVisibilityPrice = 10
  readonly canShowSolutions: Logical
  readonly canShowComments: Logical

  private constructor(props: ChallengesCraftVisilibityProps) {
    this.canShowComments = props.canShowComments
    this.canShowSolutions = props.canShowSolutions
  }

  static create(dto: ChallengesCraftVisilibityDTO) {
    return new ChallengesCraftVisilibity({
      canShowComments: Logical.create('Can show comments', dto.canShowComments),
      canShowSolutions: Logical.create('Can show solutions', dto.canShowSolutions),
    })
  }

  showSolutions() {
    return this.clone({ canShowSolutions: this.canShowSolutions.makeTrue() })
  }

  private clone(props?: Partial<ChallengesCraftVisilibityProps>) {
    return new ChallengesCraftVisilibity({
      canShowComments: this.canShowComments,
      canShowSolutions: this.canShowSolutions,
      ...props,
    })
  }
}
