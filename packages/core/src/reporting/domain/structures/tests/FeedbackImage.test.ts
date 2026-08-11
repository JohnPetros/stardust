import { FeedbackImage } from '../FeedbackImage'

describe('FeedbackImage', () => {
  it('treats the original name as display metadata', () => {
    expect(FeedbackImage.createAsOriginal('scan.JFIF', 'image/jpeg', 1).fileName).toBe(
      'scan.JFIF',
    )
    expect(FeedbackImage.createAsOriginal('capture', 'image/png', 1).fileName).toBe(
      'capture',
    )
  })

  it('keeps storage-key extension and MIME validation', () => {
    expect(() =>
      FeedbackImage.createAsStored(
        '55555555-5555-4555-8555-555555555555.png',
        'image/jpeg',
        1,
      ),
    ).toThrow('MIME type deve corresponder à extensão da imagem')
  })
})
