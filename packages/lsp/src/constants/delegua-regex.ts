export const DELEGUA_REGEX = {
  conteudoDeFuncaoLeia: /(leia\(.*\))/,
  funcaoLeia: /(leia\(\))/,
  valoresLogicos: /(?<!['"])\b(verdadeiro|falso|nulo)\b(?!['"])/g,
  parametroDeFuncaoLeia: /["'].*["']/,
  funcaoEscreva: /escreva\([^'"]*?(?:(['"])(?:(?!\1)[^\\]|\\.)*\1[^'"]*?)*[^'"]*?\)/,
  conteudoDeFuncaoEscreva: /escreva\((.*?)\)/,
  parametrosDeFuncaoQualquer: /\(([^)]+)\)/,
  nomeDeFuncaoQualquer: /fun[cç][aã]o\s+([\p{L}_][\p{L}\p{N}_]*)\s*\(/u,
  funcaoVazia: /(fun[cç][aã]o\s+[\p{L}_][\p{L}\p{N}_]*\s*\([^)]*\)\s*\{\n)(\})/gu,
}
