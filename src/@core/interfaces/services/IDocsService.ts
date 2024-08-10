import type { DocDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IDocsService {
  fetchDocs(): Promise<ServiceResponse<DocDTO[]>>
  saveUnlockedDoc(docId: string, userId: string): Promise<ServiceResponse<true>>
}
