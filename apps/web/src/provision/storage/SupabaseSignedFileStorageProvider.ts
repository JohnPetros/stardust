import { AppError } from '@stardust/core/global/errors'
import type { SignedFileStorageProvider } from '@stardust/core/storage/interfaces'
import type { SignedUploadUrl } from '@stardust/core/storage/structures'

export const SupabaseSignedFileStorageProvider = (): SignedFileStorageProvider => {
  async function uploadFile(signedUploadUrl: SignedUploadUrl, file: File): Promise<void> {
    const fileToUpload = new File([file], signedUploadUrl.fileName.value, {
      type: file.type,
      lastModified: file.lastModified,
    })

    const response = await fetch(signedUploadUrl.url.value, {
      method: 'PUT',
      body: fileToUpload,
      headers: {
        'Content-Type': fileToUpload.type || 'application/octet-stream',
        'x-upsert': 'false',
      },
    })

    if (response.ok) return

    let errorMessage = 'Falha ao enviar arquivo para o storage'

    try {
      const responseText = await response.text()
      if (responseText) {
        errorMessage = responseText
      }
    } catch {}

    throw new AppError(errorMessage)
  }

  return {
    uploadFile,
  }
}
