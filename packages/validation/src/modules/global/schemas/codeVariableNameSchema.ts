import { stringSchema } from './stringSchema'

export const codeVariableNameSchema = stringSchema.regex(
  /^[a-zA-Z_][a-zA-Z0-9_]*$/,
  'deve ser o nome possivel de uma variável',
)
