import { AppError } from './AppError'

export class MethodNotImplementedError extends AppError {
  constructor(methodName: string) {
    super(`O método ${methodName} não foi implementado`, 'Method Not Implemented Error')
  }
}
