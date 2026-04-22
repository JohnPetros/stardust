import { z } from 'zod'
import { createTool } from '@mastra/core/tools'
import { GetMdxBlocksGuideTool } from '@/ai/lesson/tools'
import { MastraMcp } from '../MastraMcp'

export class LessonToolkit {
  static get getMdxBlocksGuideTool() {
    return createTool({
      id: 'get-documentation-components-guide-tool',
      description:
        'Retorna o guia de componentes de documentacao para uso em conteudo MDX.',
      outputSchema: z.object({
        guide: z.string(),
      }),
      execute: async (input) => {
        const mcp = new MastraMcp(input)
        const tool = new GetMdxBlocksGuideTool()
        return await tool.handle(mcp)
      },
    })
  }
}
