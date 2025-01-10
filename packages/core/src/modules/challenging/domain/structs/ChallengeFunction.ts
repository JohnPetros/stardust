import type { ChallengeFunctionDto } from '#challenging/dtos'
import { Name } from '#global/structs'
import { DataType } from './DataType'

type ChallengeFunctionParam = {
  name: Name
  dataType: DataType
}

export class ChallengeFunction {
  private constructor(
    readonly name: Name,
    readonly params: ChallengeFunctionParam[],
  ) {}

  static create(dto: ChallengeFunctionDto): ChallengeFunction {
    return new ChallengeFunction(
      Name.create(dto.name),
      dto.params.map((param) => ({
        name: Name.create(param.name),
        dataType: DataType.create(param.value),
      })),
    )
  }

  get dto() {
    return {
      name: this.name.value,
      params: this.params.map((param) => ({
        name: param.name.value,
        dataType: param.dataType.name,
      })),
    }
  }
}
