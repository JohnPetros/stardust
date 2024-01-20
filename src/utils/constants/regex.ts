export const REGEX = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W\S]{6,}$/g,
  operator:
    /\s(e|ou|<=|>=|==|!=|=>|\+|-|\*\*|\*|\/|%|\+\+|--|<<|>>|\^|!|~|=|\+=|-=|\*=|\*\*=|\/=|%=)\s/,
  string: /(['"])(.*?)\1/g,
  numeric: /^[0-9]+$/,
  input: /(leia\(.*\))/,
  inputParam: /["'].*["']/,
  print: /escreva\((.*?)\)/,
  backticks: /`([^`]*)`/g,
  mdxComponent: /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g,
  componentName: /<(\w+)[\s\S]*?>/,
}
