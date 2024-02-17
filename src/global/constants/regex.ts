export const REGEX = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W\S]{6,}$/g,
  operator:
    /\s(e|ou|<=|>=|==|!=|=>|\+|-|\*\*|\*|\/|%|\+\+|--|<<|>>|\^|!|~|=|\+=|-=|\*=|\*\*=|\/=|%=)\s/,
  string: /(['"])(.*?)\1/g,
  numeric: /^-?\d+(\.\d+)?$/,
  insideInput: /(leia\(.*\))/,
  input: /(leia\(\))/,
  inputParam: /["'].*["']/,
  print: /escreva\([^'"]*?(?:(['"])(?:(?!\1)[^\\]|\\.)*\1[^'"]*?)*[^'"]*?\)/,
  insidePrint: /escreva\((.*?)\)/,
  backticks: /`([^`]*)`/g,
  asterisksCode: /&ast;/g,
  betweenTwoAsterisks: /\*(.*?)\*/g,
  betweenFourAsterisks: /\*\*(.*?)\*\*/g,
  insideQuotes: /^(['"])(.*)\1$/,
  quotes: /['"]+/g,
  mdxComponent: /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g,
  componentName: /<(\w+)[\s\S]*?>/,
  mdxCodeComponent: /<Code[^>]*>[\s\S]*?<\/Code>/gi,
}

/**
 * function formatOutput(output) {
  if (Array.isArray(output)) {
    // Map each element in the array to its formatted output
    const formattedElements = output.map(formatOutput);
    // Join the formatted elements with commas and wrap in brackets
    return '[' + formattedElements.join(', ') + ']';
  }

  // Replace quotes only if the output is a string
  return output;
}

const output = [['"text in double quote"',  1,  [2]],  1,  'verdadeiro'];
console.log(formatOutput(output));
 */
