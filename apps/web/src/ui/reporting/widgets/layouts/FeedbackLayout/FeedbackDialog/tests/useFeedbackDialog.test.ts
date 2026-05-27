import { act, renderHook } from '@testing-library/react'
import { RestResponse } from '@stardust/core/global/responses'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type {
  SignedFileStorageProvider,
  StorageService,
} from '@stardust/core/storage/interfaces'
import { type Mock, mock } from 'ts-jest-mocker'

import type { ToastContextValue } from '@/ui/global/contexts/ToastContext/types'
import { useFeedbackDialog } from '../useFeedbackDialog'

type Params = Parameters<typeof useFeedbackDialog>[0]

function createRestResponse<T>(props: {
  body?: T
  statusCode?: number
  errorMessage?: string
}) {
  return new RestResponse<T>(props)
}

describe('useFeedbackDialog', () => {
  let reportingService: Mock<ReportingService>
  let storageService: Mock<StorageService>
  let signedFileStorageProvider: Mock<SignedFileStorageProvider>
  let toast: ToastContextValue
  let fetchMock: jest.MockedFunction<typeof fetch>
  let consoleErrorSpy: jest.SpyInstance

  const user = UsersFaker.fake()
  const screenshotPreview = 'data:image/png;base64,ZmFrZQ=='
  const uploadedFileName = 'feedback-screenshot-1710000000000.png'

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useFeedbackDialog({
        reportingService,
        storageService,
        signedFileStorageProvider,
        user,
        toast,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Date, 'now').mockReturnValue(1710000000000)

    reportingService = mock<ReportingService>()
    storageService = mock<StorageService>()
    signedFileStorageProvider = mock<SignedFileStorageProvider>()
    toast = {
      showError: jest.fn(),
      showSuccess: jest.fn(),
      show: jest.fn(),
    }
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>
    global.fetch = fetchMock

    fetchMock.mockResolvedValue({
      blob: async () => new Blob(['fake-image'], { type: 'image/png' }),
    } as Response)

    storageService.createSignedUploadUrl.mockResolvedValue(
      createRestResponse({
        body: {
          url: 'https://storage.example.com/upload',
          folderPath: 'images/feedback-reports',
          fileName: uploadedFileName,
        },
        statusCode: 200,
      }),
    )

    signedFileStorageProvider.uploadFile.mockResolvedValue()
    reportingService.sendFeedbackReport.mockResolvedValue(
      createRestResponse({ statusCode: 200 }),
    )
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    jest.restoreAllMocks()
  })

  it('should upload data url screenshot with signed url before sending feedback', async () => {
    const { result } = Hook()

    act(() => {
      result.current.setContent('O dialog perde o foco apos screenshot')
      result.current.handleCropComplete(screenshotPreview)
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(storageService.createSignedUploadUrl).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'images/feedback-reports' }),
      expect.objectContaining({ value: uploadedFileName }),
    )
    expect(signedFileStorageProvider.uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: expect.objectContaining({ value: uploadedFileName }),
      }),
      expect.objectContaining({
        name: uploadedFileName,
        type: 'image/png',
      }),
    )

    const feedbackReport = reportingService.sendFeedbackReport.mock.calls[0]?.[0]

    expect(reportingService.sendFeedbackReport).toHaveBeenCalledTimes(1)
    expect(feedbackReport?.dto).toEqual(
      expect.objectContaining({
        content: 'O dialog perde o foco apos screenshot',
        intent: 'idea',
        screenshot: uploadedFileName,
      }),
    )
    expect(result.current.step).toBe('success')
  })

  it('should keep form state and stop submission when signed url creation fails', async () => {
    storageService.createSignedUploadUrl.mockResolvedValueOnce(
      createRestResponse({
        statusCode: 400,
        errorMessage: 'Falha ao gerar signed url',
      }),
    )

    const { result } = Hook()

    act(() => {
      result.current.setContent('Texto preservado')
      result.current.handleCropComplete(screenshotPreview)
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(signedFileStorageProvider.uploadFile).not.toHaveBeenCalled()
    expect(reportingService.sendFeedbackReport).not.toHaveBeenCalled()
    expect(result.current.content).toBe('Texto preservado')
    expect(result.current.screenshotPreview).toBe(screenshotPreview)
    expect(result.current.step).toBe('initial')
  })

  it('should keep form state and stop submission when direct upload throws', async () => {
    signedFileStorageProvider.uploadFile.mockRejectedValueOnce(new Error('upload failed'))

    const { result } = Hook()

    act(() => {
      result.current.setContent('Texto continua no formulario')
      result.current.handleCropComplete(screenshotPreview)
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(reportingService.sendFeedbackReport).not.toHaveBeenCalled()
    expect(result.current.content).toBe('Texto continua no formulario')
    expect(result.current.screenshotPreview).toBe(screenshotPreview)
    expect(result.current.step).toBe('initial')
  })

  it('should send feedback without upload when screenshot is not a data url', async () => {
    const { result } = Hook()

    act(() => {
      result.current.setContent('Feedback sem upload direto')
      result.current.handleCropComplete('https://cdn.stardust.dev/feedback.png')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(storageService.createSignedUploadUrl).not.toHaveBeenCalled()
    expect(signedFileStorageProvider.uploadFile).not.toHaveBeenCalled()

    const feedbackReport = reportingService.sendFeedbackReport.mock.calls[0]?.[0]

    expect(reportingService.sendFeedbackReport).toHaveBeenCalledTimes(1)
    expect(feedbackReport?.dto).toEqual(
      expect.objectContaining({
        content: 'Feedback sem upload direto',
        intent: 'idea',
        screenshot: 'https://cdn.stardust.dev/feedback.png',
      }),
    )
    expect(result.current.step).toBe('success')
  })
})
