import { ValidationError } from '#global/domain/errors/ValidationError'

type GuideCategoryValue = 'lsp' | 'mdx'

export class GuideCategory {
  private constructor(readonly value: GuideCategoryValue) {}

  static create(value: string): GuideCategory {
    if (!GuideCategory.isValid(value)) {
      throw new ValidationError([
        {
          name: 'guide-category',
          messages: ['Categoria de guia deve ser "lsp" ou "mdx"'],
        },
      ])
    }
    return new GuideCategory(value)
  }

  static isValid(value: string): value is GuideCategoryValue {
    return value === 'lsp' || value === 'mdx'
  }

  static createAsLsp(): GuideCategory {
    return new GuideCategory('lsp')
  }

  static createAsMdx(): GuideCategory {
    return new GuideCategory('mdx')
  }
}
