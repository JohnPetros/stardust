export interface ExplainCodeWorkflow {
  run(code: string): Promise<string>
}
