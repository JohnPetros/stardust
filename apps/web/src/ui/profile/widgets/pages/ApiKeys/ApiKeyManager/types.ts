export type ApiKey = {
  id: string
  name: string
  keyPreview: string
  createdAt: Date | string
}

export type CreatedApiKey = ApiKey & {
  key: string
}
