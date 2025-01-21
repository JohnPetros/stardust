import type { IAuthService,  IUseCase } from '#interfaces'

type Request = {
  userName: string
  userEmail: string
  userPassword: string
}

export class SignUpUserUseCase implements IUseCase<Request> {
  constructor(
    private readonly authService: IAuthService,
  ) {}

  async do({ userEmail, userPassword }: Request) {
    const response = await this.authService.signUp(userEmail, userPassword)
    if (response.isFailure) response.throwError()

    const { userId } = response.body
    return {
      userId
    }
  }
}
