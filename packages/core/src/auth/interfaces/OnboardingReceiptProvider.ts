import type { Email, Id, Name, Text } from '#global/domain/structures/index'

export interface OnboardingReceiptProvider {
  issue(
    accountId: Id,
    email: Email,
    name: Name,
  ): Promise<{ receipt: Text; expiresAt: Date }>
  verify(
    receipt: Text,
  ): Promise<{ accountId: Id; email: Email; name: Name; expiresAt: Date }>
}
