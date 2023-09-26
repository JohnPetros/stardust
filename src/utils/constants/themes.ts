import type { ThemeName } from '@/@types/themeName'
import type { Token } from '@/@types/token'

type Theme = {
  [themeName in ThemeName]: {
    [token in Token]: string
  }
}

export const THEMES: Theme = {
  darkSpace: {
    keywords: '#0FE983',
    strings: '#F1FA8C',
    comments: '#999999',
    operators: '#1494cc',
    numbers: '#00D1FF',
    booleans: '#00D1FF',
    typeKeywords: '#0ac899',
    rest: '#EBEBEB',
    editor: '#1E2626',
  },
}
