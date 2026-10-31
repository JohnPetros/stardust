import type { ToolsInput } from '@mastra/core/agent'

export type ToolResultTransform = (result: unknown) => unknown

export function withResultTransform(
  tool: ToolsInput[string],
  transform: ToolResultTransform,
): ToolsInput[string] {
  const toolAction = tool as { execute?: (...args: unknown[]) => Promise<unknown> }
  const execute = toolAction.execute

  if (!execute) return tool

  const transformedTool = Object.assign(
    Object.create(Object.getPrototypeOf(tool)),
    tool,
  ) as typeof toolAction

  transformedTool.execute = async (...args) => transform(await execute.apply(tool, args))

  return transformedTool as ToolsInput[string]
}
