export const DELEGUA_REGEX = {
  dentroDeLeia: /(leia\(.*\))/,
  leia: /(leia\(\))/,
  parametroDeLeia: /["'].*["']/,
  escreva: /escreva\([^'"]*?(?:(['"])(?:(?!\1)[^\\]|\\.)*\1[^'"]*?)*[^'"]*?\)/,
  dentroDeEscreva: /escreva\((.*?)\)/,
}
