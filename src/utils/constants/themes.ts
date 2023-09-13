import { ThemeName } from "@/types/themeName"

type Theme = {
  [themeName in ThemeName]: {
    [token: string]: string
  }
}

export const THEMES: Theme = {
  darkSpace: {
    keywords: '#0FE983',
    string: '#999999',
    comments: '#F1FA8C',
    operators: '#1494cc',
    numbers: '#00D1FF',
    booleans: '#00D1FF',
    typeKeywords: '#0ac899',
  },
}
