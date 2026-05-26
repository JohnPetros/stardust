export const DELEGUA_REGEX = {
  conteúdoDeFuncaoLeia: /leia\([^)]*\)/,
  funcaoLeia: /(leia\(\))/,
  valoresLogicos: /(?<!['"])\b(verdadeiro|falso|nulo)\b(?!['"])/g,
  parametroDeFuncaoLeia: /["'].*["']/,
  funcaoEscreva: /escreva\([^'"]*?(?:(['"])(?:(?!\1)[^\\]|\\.)*\1[^'"]*?)*[^'"]*?\)/,
  conteúdoDeFuncaoEscreva: /escreva\((.*?)\)/,
  parametrosDeFuncaoQualquer: /\(([^)]+)\)/,
  nomeDeFuncaoQualquer: /funcao\s+(\w+)\s*\(/,
} as const
