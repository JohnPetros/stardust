export const VercelMcp = <Input = void>(input: Input) => {
  return {
    getInput(): Input {
      return input
    },
  }
}
