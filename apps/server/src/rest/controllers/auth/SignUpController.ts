import type { Controller, Broker } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type {
  OnboardingReceiptProvider,
  AuthService,
} from '@stardust/core/auth/interfaces'
import { Email, Id, Name } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'
import { AccountSignedUpEvent } from '@stardust/core/auth/events'

type Schema = {
  body: {
    email: string
    password: string
    name: string
  }
}

export class SignUpController implements Controller<Schema> {
  constructor(
    private readonly authService: AuthService,
    private readonly broker: Broker,
    private readonly receiptProvider: OnboardingReceiptProvider,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email, password, name } = await http.getBody()
    const response = await this.authService.signUp(
      Email.create(email),
      Password.create(password),
    )
    const isEligible = response.getHeader('X-Onboarding-SignUp-Eligible') === 'true'
    Reflect.deleteProperty(response.headers, 'X-Onboarding-SignUp-Eligible')
    if (response.isSuccessful && !response.isFailure && isEligible) {
      await this.issueOnboardingReceipt(response, email, name)
    }

    return response
  }

  private async issueOnboardingReceipt<Body extends { id?: unknown }>(
    response: RestResponse<Body>,
    email: string,
    name: string,
  ): Promise<void> {
    const accountId = Id.create(String(response.body.id))
    const issued = await this.receiptProvider.issue(
      accountId,
      Email.create(email),
      Name.create(name),
    )
    const event = new AccountSignedUpEvent({
      accountId: accountId.value,
      accountEmail: email,
      accountName: name,
    })
    await this.broker.publish(event)
    response.headers['X-Onboarding-Receipt'] = issued.receipt.value
    response.headers['X-Onboarding-Expires-At'] = issued.expiresAt.toISOString()
  }
}
