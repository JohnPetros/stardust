import { pgEnum } from 'drizzle-orm/pg-core'

export const guideCategoryModel = pgEnum('guide_category', ['lsp', 'mdx'])
