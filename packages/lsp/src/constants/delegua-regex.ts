export const DELEGUA_REGEX = {
  conteudoDeFuncaoLeia: /(leia\(.*\))/,
  funcaoLeia: /(leia\(\))/,
  valoresLogicos: /(?<!['"])\b(verdadeiro|falso|nulo)\b(?!['"])/g,
  parametroDeFuncaoLeia: /["'].*["']/,
  funcaoEscreva: /escreva\([^'"]*?(?:(['"])(?:(?!\1)[^\\]|\\.)*\1[^'"]*?)*[^'"]*?\)/,
  conteudoDeFuncaoEscreva: /escreva\((.*?)\)/,
  parametrosDeFuncaoQualquer: /\(([^)]+)\)/,
  nomeDeFuncaoQualquer: /funcao\s+(\w+)\s*\(/,
}
