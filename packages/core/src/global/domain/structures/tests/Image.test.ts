import { ValidationError } from '../../errors'
import { Image } from '../Image'

describe('Image structure', () => {
  it('should be created with a valid image value', () => {
    expect(() => Image.create('image.png')).not.toThrow()
    expect(() => Image.create('image.jpg')).not.toThrow()
    expect(() => Image.create('image.jpeg')).not.toThrow()
    expect(() => Image.create('image.gif')).not.toThrow()
    expect(() => Image.create('image.svg')).not.toThrow()
    expect(() => Image.create('image.pdf')).toThrow(ValidationError)
    expect(() => Image.create('image')).toThrow(ValidationError)
    expect(() => Image.create('image.ghggghghg')).toThrow(ValidationError)
  })
})
