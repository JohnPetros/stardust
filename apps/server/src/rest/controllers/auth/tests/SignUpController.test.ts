import { mock, type Mock } from 'ts-jest-mocker'
import type { Broker } from '@stardust/core/global/interfaces'
import type {
  AuthService,
  OnboardingReceiptProvider,
} from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { AccountSignedUpEvent } from '@stardust/core/auth/events'
import { Password } from '@stardust/core/auth/structures'
import { Email, Id, Name, Text } from '@stardust/core/global/structures'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { SignUpController } from '../SignUpController'

describe('Sign Up Controller', () => {
  let http: Mock<Parameters<SignUpController['handle']>[0]>
  let service: Mock<AuthService>
  let broker: Mock<Broker>
  let provider: Mock<OnboardingReceiptProvider>
  let controller: SignUpController
  const email = 'test@test.com'
  const password = 'password'
  const name = 'test name'
  const expiresAt = new Date('2030-01-01T00:15:00Z')

  beforeEach(() => {
    http = mock<Parameters<SignUpController['handle']>[0]>()
    service = mock<AuthService>()
    broker = mock<Broker>()
    broker.publish.mockResolvedValue(undefined)
    provider = mock<OnboardingReceiptProvider>()
    provider.issue.mockResolvedValue({
      receipt: Text.create('synthetic-receipt'),
      expiresAt,
    })
    http.getBody.mockResolvedValue({ email, password, name })
    controller = new SignUpController(service, broker, provider)
  })

  it('preserves signup response without granting an ineligible attempt', async () => {
    const response = new RestResponse({ body: AccountsFaker.fakeDto(), statusCode: 201 })
    service.signUp.mockResolvedValue(response)
    expect(await controller.handle(http)).toBe(response)
    expect(service.signUp).toHaveBeenCalledWith(
      Email.create(email),
      Password.create(password),
    )
    expect(provider.issue).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
    expect(response.getHeader('X-Onboarding-Receipt')).toBeNull()
  })

  it('issues receipt and publishes only the account returned by an eligible signup', async () => {
    const account = AccountsFaker.fakeDto()
    const response = new RestResponse({
      body: account,
      statusCode: 201,
      headers: { 'X-Onboarding-SignUp-Eligible': 'true' },
    })
    service.signUp.mockResolvedValue(response)
    await controller.handle(http)
    expect(provider.issue).toHaveBeenCalledWith(
      Id.create(String(account.id)),
      Email.create(email),
      Name.create(name),
    )
    expect(broker.publish).toHaveBeenCalledWith(
      new AccountSignedUpEvent({
        accountId: String(account.id),
        accountEmail: email,
        accountName: name,
      }),
    )
    expect(response.getHeader('X-Onboarding-SignUp-Eligible')).toBeNull()
    expect(response.getHeader('X-Onboarding-Receipt')).toBe('synthetic-receipt')
    expect(response.getHeader('X-Onboarding-Expires-At')).toBe(expiresAt.toISOString())
  })

  it('does not access failed response body or publish a receipt', async () => {
    const response = new RestResponse<AccountDto>({
      statusCode: 409,
      errorMessage: 'Cadastro indisponível',
      headers: { 'X-Onboarding-SignUp-Eligible': 'true' },
    })
    service.signUp.mockResolvedValue(response)
    expect(await controller.handle(http)).toBe(response)
    expect(provider.issue).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
    expect(response.getHeader('X-Onboarding-SignUp-Eligible')).toBeNull()
  })
})
