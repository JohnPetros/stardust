import { Logical } from '../../../global/domain/structures'

type ChallengeCraftsVisibilityDto = {
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

  static create(dto: ChallengeCraftsVisibilityDto) {
    return new ChallengeCraftsVisibility({
      canShowComments: Logical.create(dto.canShowComments, 'Pode mostrar comentários?'),
      canShowSolutions: Logical.create(dto.canShowSolutions, 'Pode mostrar soluções?'),
    })
  }

  showSolutions() {
    return this.clone({ canShowSolutions: this.canShowSolutions.becomeTrue() })
  }

  showComments() {
    return this.clone({ canShowComments: this.canShowComments.becomeTrue() })
  }

  showAll() {
    return this.showComments().showSolutions()
  }

  private clone(props?: Partial<ChallengeCraftsVisibilityProps>) {
    return new ChallengeCraftsVisibility({
      canShowComments: this.canShowComments,
      canShowSolutions: this.canShowSolutions,
      ...props,
    })
  }
}
