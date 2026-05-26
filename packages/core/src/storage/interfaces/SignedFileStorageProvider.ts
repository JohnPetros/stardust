import type { SignedUploadUrl } from '../domain/structures'

export interface SignedFileStorageProvider {
  uploadFile(signedUploadUrl: SignedUploadUrl, file: File): Promise<void>
}
