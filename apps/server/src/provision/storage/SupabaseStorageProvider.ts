import type { SupabaseClient } from '@supabase/supabase-js'

import { AppError } from '@stardust/core/global/errors'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { FilesListingParams } from '@stardust/core/storage/types'
import type { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'

export class SupabaseStorageProvider implements StorageProvider {
  private static readonly BUCKET_NAME = 'images'

  constructor(private readonly supabase: SupabaseClient) {}

  async upload(folder: StorageFolder, file: File): Promise<File> {
    const filePath = `${folder.name}/${file.name}`
    const contentType = file.type || 'application/octet-stream'

    const { data, error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType,
        upsert: false,
      })

    if (error) {
      await this.handleError(error, `uploading ${filePath}`)
    }

    if (!data?.path) {
      throw new AppError('Failed to upload file: No file path returned')
    }

    return file
  }

  async listFiles({
    folder,
    page,
    itemsPerPage,
    search,
  }: FilesListingParams): Promise<ManyItems<File>> {
    const { data, error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .list(folder.name, {
        limit: itemsPerPage.value,
        offset: (page.value - 1) * itemsPerPage.value,
        search: search.value,
      })

    if (error) {
      await this.handleError(error, `listing files in ${folder.name}`)
    }

    const response = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .list(folder.name, {
        offset: 0,
        search: search.value,
      })

    const files: File[] = []

    for (const item of data ?? []) {
      if (item.name) {
        const file = await this.getFile(folder, Text.create(item.name))
        if (file) files.push(file)
      }
    }

    return { items: files, count: response.data?.length ?? 0 }
  }

  async findFile(folder: StorageFolder, fileName: Text): Promise<File | null> {
    const { data, error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .list(folder.name, {
        offset: 0,
        search: fileName.value,
      })

    if (error) {
      await this.handleError(error, `finding file ${fileName.value} in ${folder.name}`)
    }

    if (!data?.length) {
      return null
    }

    return this.getFile(folder, fileName)
  }

  private async getFile(folder: StorageFolder, fileName: Text): Promise<File | null> {
    const { data: urlData } = this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .getPublicUrl(`${folder.name}/${fileName.value}`)

    const response = await fetch(urlData.publicUrl)
    const blob = await response.blob()
    const file = new File([blob], fileName.value, {
      type: 'application/octet-stream',
    })
    return file
  }

  async removeFile(folder: StorageFolder, fileName: Text): Promise<void> {
    const { error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .remove([`${folder.name}/${fileName.value}`])

    if (error) {
      await this.handleError(error, `removing file ${fileName.value} from ${folder.name}`)
    }
  }

  private async handleError(error: Error, operation: string): Promise<never> {
    const message = await this.resolveErrorMessage(error)
    const errorMessage = `Error while ${operation}: ${message}`

    console.error('Supabase Storage Provider error:', {
      message: errorMessage,
      originalError: error,
    })

    throw new AppError(errorMessage, 'Supabase Storage ProviderError')
  }

  private async resolveErrorMessage(error: Error): Promise<string> {
    const fallbackMessage = error.message || 'Unknown storage error'
    const response = this.getErrorResponse(error)

    if (!response) {
      return fallbackMessage
    }

    const responseMessage = await this.readResponseMessage(response)
    if (!responseMessage) {
      return `Supabase returned ${response.status} ${response.statusText}`
    }

    return responseMessage
  }

  private getErrorResponse(error: Error): ResponseLike | null {
    const originalError = (error as ErrorWithOriginalError).originalError

    if (!originalError || typeof originalError !== 'object') {
      return null
    }

    if (
      'status' in originalError &&
      'statusText' in originalError &&
      'headers' in originalError &&
      'json' in originalError &&
      'text' in originalError
    ) {
      return originalError as ResponseLike
    }

    return null
  }

  private async readResponseMessage(response: ResponseLike): Promise<string | null> {
    const statusMessage = `Supabase returned ${response.status} ${response.statusText}`
    const requestId = response.headers.get('sb-request-id')

    try {
      const errorData = await response.clone().json()
      const parsedMessage = this.extractMessageFromErrorData(errorData)

      if (parsedMessage) {
        return requestId
          ? `${statusMessage}. Request ID: ${requestId}. ${parsedMessage}`
          : `${statusMessage}. ${parsedMessage}`
      }
    } catch {}

    try {
      const text = await response.clone().text()
      if (text) {
        return requestId
          ? `${statusMessage}. Request ID: ${requestId}. ${text}`
          : `${statusMessage}. ${text}`
      }
    } catch {}

    return requestId ? `${statusMessage}. Request ID: ${requestId}` : statusMessage
  }

  private extractMessageFromErrorData(data: unknown): string | null {
    if (typeof data === 'string') {
      return data
    }

    if (!data || typeof data !== 'object') {
      return null
    }

    const errorData = data as Record<string, unknown>
    const messageParts = [
      errorData.message,
      errorData.error,
      errorData.msg,
      errorData.error_description,
      errorData.code,
    ].filter((value): value is string => {
      return typeof value === 'string' && value.length > 0
    })

    if (messageParts.length === 0) {
      return JSON.stringify(errorData)
    }

    return messageParts.join(' | ')
  }
}

type ErrorWithOriginalError = Error & {
  originalError?: unknown
}

type ResponseLike = {
  status: number
  statusText: string
  headers: Headers
  clone: () => ResponseLike
  json: () => Promise<unknown>
  text: () => Promise<string>
}
