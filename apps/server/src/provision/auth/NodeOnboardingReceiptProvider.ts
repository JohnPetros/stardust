import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import type { OnboardingReceiptProvider } from '@stardust/core/auth/interfaces'
import { AppError, AuthError } from '@stardust/core/global/errors'
import { Email, Id, Name, Text } from '@stardust/core/global/structures'

const claimsSchema = z
  .object({
    version: z.literal(1),
    audience: z.literal('profile-onboarding'),
    accountId: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1),
    nonce: z.string().min(1),
    iat: z.number().int().nonnegative(),
    exp: z.number().int().nonnegative(),
  })
  .strict()

export class NodeOnboardingReceiptProvider implements OnboardingReceiptProvider {
  constructor(private readonly secret: string) {
    if (Buffer.byteLength(secret) < 32)
      throw new AppError('Configuração de onboarding inválida')
  }

  async issue(accountId: Id, email: Email, name: Name) {
    const { payload, exp } = this.composePayload(accountId, email, name)
    return {
      receipt: Text.create(`${payload}.${this.sign(payload).toString('base64url')}`),
      expiresAt: new Date(exp * 1000),
    }
  }

  async verify(receipt: Text) {
    try {
      const payload = this.verifySignature(receipt)
      const claims = this.parseClaims(payload)
      return this.projectClaims(claims)
    } catch {
      throw new AuthError('Tentativa de cadastro inválida ou expirada')
    }
  }

  private composePayload(accountId: Id, email: Email, name: Name) {
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + 900
    const payload = Buffer.from(
      JSON.stringify({
        version: 1,
        audience: 'profile-onboarding',
        accountId: accountId.value,
        email: email.value,
        name: name.value,
        nonce: randomBytes(32).toString('base64url'),
        iat,
        exp,
      }),
    ).toString('base64url')
    return { payload, exp }
  }

  private verifySignature(receipt: Text): string {
    const parts = receipt.value.split('.')
    if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part)))
      throw new AuthError('Tentativa inválida')
    const [payload, signature] = parts
    const expected = this.sign(payload)
    const actual = Buffer.from(signature, 'base64url')
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      throw new AuthError('Tentativa inválida')
    return payload
  }

  private parseClaims(payload: string) {
    const claims = claimsSchema.parse(
      JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')),
    )
    this.validateTemporalClaims(claims, Math.floor(Date.now() / 1000))
    return claims
  }

  private validateTemporalClaims(claims: z.infer<typeof claimsSchema>, now: number) {
    if (claims.iat > now || claims.exp <= now || claims.exp - claims.iat !== 900)
      throw new AuthError('Tentativa inválida')
  }

  private projectClaims(claims: z.infer<typeof claimsSchema>) {
    return {
      accountId: Id.create(claims.accountId),
      email: Email.create(claims.email),
      name: Name.create(claims.name),
      expiresAt: new Date(claims.exp * 1000),
    }
  }

  private sign(payload: string): Buffer {
    return createHmac('sha256', this.secret).update(payload).digest()
  }
}
