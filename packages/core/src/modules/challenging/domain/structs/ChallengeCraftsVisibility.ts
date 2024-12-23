import { Logical } from '#global/structs'

type ChallengeCraftsVisibilityDTO = {
  canShowSolutions: boolean
  canShowComments: boolean
}

type ChallengeCraftsVisibilityProps = {
  canShowSolutions: Logical
  canShowComments: Logical
}

export class ChallengeCraftsVisibility {
  static readonly solutionsVisibilityPrice = 10
  readonly canShowSolutions: Logical
  readonly canShowComments: Logical

  private constructor(props: ChallengeCraftsVisibilityProps) {
    this.canShowComments = props.canShowComments
    this.canShowSolutions = props.canShowSolutions
  }

  static create(dto: ChallengeCraftsVisibilityDTO) {
    return new ChallengeCraftsVisibility({
      canShowComments: Logical.create('Can show comments', dto.canShowComments),
      canShowSolutions: Logical.create('Can show solutions', dto.canShowSolutions),
    })
  }

  showSolutions() {
    return this.clone({ canShowSolutions: this.canShowSolutions.makeTrue() })
  }

  private clone(props?: Partial<ChallengeCraftsVisibilityProps>) {
    return new ChallengeCraftsVisibility({
      canShowComments: this.canShowComments,
      canShowSolutions: this.canShowSolutions,
      ...props,
    })
  }
}
