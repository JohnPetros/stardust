import { createClient } from '@supabase/supabase-js'

import { AppError } from '@stardust/core/global/errors'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { FilesListingParams } from '@stardust/core/storage/types'
import type { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'

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
      .upload(`${folder.name}/${file.name}`, file, {
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
  }: FilesListingParams): Promise<{ files: File[]; totalFilesCount: number }> {
    const { data, error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .list(folder.name, {
        limit: itemsPerPage.value,
        offset: (page.value - 1) * itemsPerPage.value,
        search: search.value,
      })

    if (error) {
      this.handleError(error)
    }

    const response = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .list(folder.name, {
        offset: 0,
        search: search.value,
      })

    const files: File[] = []

    for (const item of data) {
      if (item.name) {
        const file = await this.getFile(folder, Text.create(item.name))
        if (file) files.push(file)
      }
    }

    return { files, totalFilesCount: response.data?.length ?? 0 }
  }

  async findFile(folder: StorageFolder, fileName: Text): Promise<File | null> {
    const { data, error } = await this.supabase.storage
      .from(SupabaseStorageProvider.BUCKET_NAME)
      .list(folder.name, {
        offset: 0,
        search: fileName.value,
      })

    if (error) {
      this.handleError(error)
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
      this.handleError(error)
    }
  }

  private handleError(error: Error): never {
    console.error('Supabase Storage Provider error:', error)
    throw new AppError(error.message, 'Supabase Storage ProviderError')
  }
}
