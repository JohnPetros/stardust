import { createMockModel } from '@mastra/core/test-utils/llm-mock'
import type { LanguageModel } from '@mastra/core/llm'

export type ScriptedStep =
  | { toolCalls: Array<{ name: string; input: unknown }> }
  | { text: unknown }

export type OfferedTool = {
  name: string
  inputSchema: Record<string, unknown>
}

const USAGE = { inputTokens: 10, outputTokens: 5, totalTokens: 15 }

type ScriptedCallOptions = {
  tools?: Array<Record<string, unknown>>
  prompt?: unknown[]
  responseFormat?: unknown
  toolChoice?: unknown
  providerOptions?: unknown
}

export class ScriptedModel {
  readonly model: LanguageModel
  readonly offeredTools: OfferedTool[][] = []
  readonly prompts: unknown[][] = []
  readonly responseFormats: unknown[] = []
  readonly toolChoices: unknown[] = []
  readonly providerOptions: unknown[] = []
  private readonly steps: ScriptedStep[]
  private stepIndex = 0

  constructor(steps: ScriptedStep[]) {
    this.steps = steps

    const MockModel = Object.getPrototypeOf(createMockModel({ mockText: '' })).constructor

    this.model = new MockModel({
      doGenerate: async (options: ScriptedCallOptions) => {
        const step = this.nextStep(options)

        return {
          content: this.toContent(step),
          finishReason: 'toolCalls' in step ? 'tool-calls' : 'stop',
          usage: USAGE,
          warnings: [],
        }
      },
      doStream: async (options: ScriptedCallOptions) => {
        const step = this.nextStep(options)
        const chunks = [
          { type: 'stream-start', warnings: [] },
          ...this.toContent(step).flatMap((part, index) =>
            part.type === 'tool-call'
              ? [part]
              : [
                  { type: 'text-start', id: `t${index}` },
                  { type: 'text-delta', id: `t${index}`, delta: part.text },
                  { type: 'text-end', id: `t${index}` },
                ],
          ),
          {
            type: 'finish',
            finishReason: 'toolCalls' in step ? 'tool-calls' : 'stop',
            usage: USAGE,
          },
        ]

        return {
          stream: new ReadableStream({
            start(controller) {
              for (const chunk of chunks) controller.enqueue(chunk)
              controller.close()
            },
          }),
        }
      },
    })
  }

  private nextStep(options: ScriptedCallOptions): ScriptedStep {
    this.prompts.push(options.prompt ?? [])
    this.responseFormats.push(options.responseFormat)
    this.toolChoices.push(options.toolChoice)
    this.providerOptions.push(options.providerOptions)
    this.offeredTools.push(
      (options.tools ?? []).map((tool) => ({
        name: String(tool.name),
        inputSchema: (tool.inputSchema ?? tool.parameters ?? {}) as Record<
          string,
          unknown
        >,
      })),
    )

    const step = this.steps[Math.min(this.stepIndex, this.steps.length - 1)]
    this.stepIndex++

    return step
  }

  private toContent(step: ScriptedStep): Array<Record<string, string>> {
    return 'toolCalls' in step
      ? step.toolCalls.map((call, index) => ({
          type: 'tool-call',
          toolCallId: `call-${this.stepIndex}-${index}`,
          toolName: call.name,
          input: JSON.stringify(call.input),
        }))
      : [
          {
            type: 'text',
            text: typeof step.text === 'string' ? step.text : JSON.stringify(step.text),
          },
        ]
  }
}
