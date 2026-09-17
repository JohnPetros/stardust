import { slugSchema } from '../../global/schemas'

/** Safe key used in the roadmap query string and API path. */
export const roadmapNodeKeySchema = slugSchema.max(
  100,
  'A chave do nó deve conter no máximo 100 caracteres',
)
