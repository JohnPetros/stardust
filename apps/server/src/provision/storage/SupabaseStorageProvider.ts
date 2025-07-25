import { createReadStream } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

import { AppError } from '@stardust/core/global/errors'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { FilesListingParams, StorageFolder } from '@stardust/core/storage/types'
import type { Text } from '@stardust/core/global/structures'

import { ENV } from '@/constants'

export class SupabaseStorageProvider implements StorageProvider {
  private static readonly BUCKET_NAME = 'images'
  private readonly supabase

  constructor() {
    this.supabase = createClient(ENV.supabaseUrl, ENV.supabaseKey)
  }

  async upload(folder: StorageFolder, file: File): Promise<File> {
    const { data, error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .upload(`${folder}/${file.name}`, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      this.handleError(error)
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
  }: FilesListingParams): Promise<File[]> {
    const { data, error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .list(folder, {
        limit: itemsPerPage.value,
        offset: (page.value - 1) * itemsPerPage.value,
        search: search.value,
      })

    if (error) {
      this.handleError(error)
    }

    if (!data) {
      return []
    }

    const files: File[] = []

    for (const item of data) {
      if (item.name) {
        const { data: urlData } = this.supabase.storage
          .from(SupabaseStorageProvider.BUCKET_NAME)
          .getPublicUrl(item.name)

        if (urlData?.publicUrl) {
          const response = await fetch(urlData.publicUrl)
          const blob = await response.blob()
          const file = new File([blob], item.name, {
            type: item.metadata?.mimetype || 'application/octet-stream',
          })
          files.push(file)
        }
      }
    }

    return files
  }

  async removeFile(folder: StorageFolder, fileName: Text): Promise<void> {
    const { error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .remove([`${folder}/${fileName.value}`])

    if (error) {
      this.handleError(error)
    }
  }

  private handleError(error: Error): never {
    console.error('Supabase Storage Provider error:', error)
    throw new AppError(error.message, 'Supabase Storage ProviderError')
  }
}
