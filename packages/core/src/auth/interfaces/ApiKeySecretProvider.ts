export interface ApiKeySecretProvider {
  generateToken(byteLength: number): string
  hash(value: string): string
}
