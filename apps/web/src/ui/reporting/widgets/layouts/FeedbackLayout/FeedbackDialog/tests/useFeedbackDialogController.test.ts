import { createFeedbackAttachmentStorageFile } from '../useFeedbackDialogController'

describe('createFeedbackAttachmentStorageFile', () => {
  it('renames PNG attachments to a UUID storage filename', () => {
    const file = new File(['image'], 'screenshot final.png', {
      type: 'image/png',
      lastModified: 1710000000000,
    })

    const storageFile = createFeedbackAttachmentStorageFile(file)

    expect(storageFile.name).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.png$/i,
    )
    expect(storageFile.type).toBe('image/png')
    expect(storageFile.size).toBe(file.size)
    expect(storageFile.lastModified).toBe(file.lastModified)
  })

  it('renames JPEG attachments to a UUID storage filename', () => {
    const file = new File(['image'], 'evidence.jpeg', { type: 'image/jpeg' })

    expect(createFeedbackAttachmentStorageFile(file).name).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.jpg$/i,
    )
  })
})
