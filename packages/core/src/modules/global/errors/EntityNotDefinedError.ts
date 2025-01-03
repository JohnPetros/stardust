import { AppError } from './AppError'

export class EntityNotDefinedError extends AppError {
  constructor(entityName = 'Entidade') {
    super(`${entityName} não definido`, 'Entity not defined Error')
  }
}
