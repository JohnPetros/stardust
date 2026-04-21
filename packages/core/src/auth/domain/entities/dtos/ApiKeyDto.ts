export type ApiKeyDto = {
  id: string
  name: string
  keyHash: string
  keyPreview: string
  userId: string
  createdAt: Date
  revokedAt?: Date
}
