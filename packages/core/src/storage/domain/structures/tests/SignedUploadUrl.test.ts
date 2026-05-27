import { SignedUploadUrl } from '../SignedUploadUrl'

describe('SignedUploadUrl', () => {
  it('should allow feedback report screenshots with supported extensions', () => {
    expect(() =>
      SignedUploadUrl.create({
        url: 'https://storage.stardust.dev/upload',
        folderPath: 'images/feedback-reports',
        fileName: 'feedback.webp',
      }),
    ).not.toThrow()

    expect(() =>
      SignedUploadUrl.create({
        url: 'https://storage.stardust.dev/upload',
        folderPath: 'images/feedback-reports',
        fileName: 'feedback.gif',
      }),
    ).toThrow('Invalid file extension for folder path: images/feedback-reports')
  })

  it('should throw when file extension is not allowed for the folder path', () => {
    expect(() =>
      SignedUploadUrl.create({
        url: 'https://storage.stardust.dev/upload',
        folderPath: 'images/story',
        fileName: 'theme.mp3',
      }),
    ).toThrow('Invalid file extension for folder path: images/story')
  })

  it('should create a signed upload url with an allowed extension and return its dto', () => {
    const signedUploadUrl = SignedUploadUrl.create({
      url: 'https://storage.stardust.dev/upload',
      folderPath: 'images/story',
      fileName: 'cover.png',
    })

    expect(signedUploadUrl.dto).toEqual({
      url: 'https://storage.stardust.dev/upload',
      folderPath: 'images/story',
      fileName: 'cover.png',
    })
  })
})
