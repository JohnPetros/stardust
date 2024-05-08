import { serialize } from 'next-mdx-remote/serialize'

import { APP_ERRORS } from '@/global/constants'
import { getComponentContent } from '@/global/helpers'

const CONTENT_PLACEHOLDER = '@component-content'

export async function compileMdxComponent(component: string) {
  const componentContent = getComponentContent(component)

  if (!componentContent) throw new Error(APP_ERRORS.mdx.failedCompiling)

  const componentToBeCompiled = component.replace(
    componentContent,
    CONTENT_PLACEHOLDER
  )

  const mdx = await serialize(componentToBeCompiled)

  const compiledMdx = mdx.compiledSource.replace(
    CONTENT_PLACEHOLDER,
    componentContent
  )

  mdx.compiledSource = compiledMdx

  return mdx
}

/**
 * let str = `<Text picture="panda.jpg">
      Parace que permitirem você entrar no planeta datahon
    </Text>

      # Title 1
       
      <Text picture="panda.jpg">
        Entretanto, é melhor fazer uma análise do ambiente antes de fazer um
        pouso seguro.
      </Text>

      ## Title 2

      <Text picture="panda.jpg">
        Isso o seu foguete já fez de antemão, retornando para você dados do
        planeta como nome, temperatura e se tem ar respirável.
      </Text>

      <Alert picture="panda.jpg">
        Isso o seu foguete já fez de antemão, retornando para você dados do
        planeta como nome, temperatura e se tem ar respirável.
      </Alert>

    <Quote picture="panda.jpg">
      Isso o seu foguete já fez de antemão, retornando para você dados do
      planeta como nome, temperatura e se tem ar respirável.
    </Quote>

    <Code isRunnable={true}>
      Isso o seu foguete já fez de antemão, retornando para você dados do
      planeta como nome, temperatura e se tem ar respirável.
    </Code>`; // Your string here

let regex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
let result;
while ((result = regex.exec(str)) !== null) {
    console.log(`${result[0]}`)
}
str = str.replace(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g, 'mdx-component');
// console.log(str);
 */
