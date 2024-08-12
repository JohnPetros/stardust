export const DELEGUA_REGEX = {
  conteudoDeFuncaoLeia: /(leia\(.*\))/,
  funcaoLeia: /(leia\(\))/,
  parametroDeFuncaoLeia: /["'].*["']/,
  funcaoEscreva: /escreva\([^'"]*?(?:(['"])(?:(?!\1)[^\\]|\\.)*\1[^'"]*?)*[^'"]*?\)/,
  conteudoDeFuncaoEscreva: /escreva\((.*?)\)/,
}
