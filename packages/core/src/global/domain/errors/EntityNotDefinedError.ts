import { AppError } from './AppError'

export class EntityNotDefinedError extends AppError {
  constructor(entityName = 'Entidade') {
    super(`Entidade ${entityName} não definida`, 'Entity not defined Error')
  }
}
