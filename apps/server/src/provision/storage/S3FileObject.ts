import { randomUUID } from 'node:crypto'

export const S3FileObject = {
  resolveFileName(file: File): string {
    const trimmedName = file.name?.trim()

    if (trimmedName) {
      return trimmedName
    }

    const extension = S3FileObject.extensionFromType(file.type)
    return `${randomUUID()}.${extension}`
  },

  resolveContentType(file: File, fileName: string): string {
    const trimmedType = file.type?.trim()

    if (trimmedType) {
      return trimmedType
    }

    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension === 'wav') return 'audio/wav'
    if (extension === 'mp3') return 'audio/mpeg'
    if (extension === 'ogg') return 'audio/ogg'

    return 'application/octet-stream'
  },

  normalizeFile(file: File, fileName: string, contentType: string): File {
    if (file.name === fileName && file.type === contentType) {
      return file
    }

    return new File([file], fileName, {
      type: contentType,
      lastModified: Date.now(),
    })
  },

  extensionFromType(type?: string | null): string {
    const normalizedType = type?.trim().toLowerCase()

    if (!normalizedType) {
      return 'bin'
    }

    if (normalizedType === 'audio/wav') return 'wav'
    if (normalizedType === 'audio/mpeg') return 'mp3'
    if (normalizedType === 'audio/ogg') return 'ogg'

    return 'bin'
  },
}
