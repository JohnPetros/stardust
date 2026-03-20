import type { ChallengeNavigationDto } from './dtos'

type Props = {
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
}

export class ChallengeNavigation {
  private constructor(
    readonly previousChallengeSlug: string | null,
    readonly nextChallengeSlug: string | null,
  ) {}

  static create(props: Props) {
    return new ChallengeNavigation(props.previousChallengeSlug, props.nextChallengeSlug)
  }

  get dto(): ChallengeNavigationDto {
    return {
      previousChallengeSlug: this.previousChallengeSlug,
      nextChallengeSlug: this.nextChallengeSlug,
    }
  }
}
