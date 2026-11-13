# Regras do Arquivo de Design (Penpot)

Este documento define a propriedade das páginas, a nomenclatura de frames e a
colocação de componentes no arquivo `stardust` do Penpot. Ele complementa
`documentation/rules/mcp-rules.md` (uso do Penpot MCP) e
`documentation/design.md` (referências aprovadas e tokens).

## Páginas do arquivo

O arquivo `stardust` tem quatro páginas, cada uma com uma função. Coloque cada
frame na página que é dona dele e consulte os IDs das páginas pelo Penpot MCP
(`execute_code`) em vez de fixá-los.

| Página | Contém | Nome dos frames |
| --- | --- | --- |
| 🖥️ Desktop | Telas desktop completas, 1440 de largura (1440 × 900 por padrão) | `<Domínio> / Desktop / <Tela> · <estado>` |
| 📱 Mobile | A versão mobile das telas do Desktop, 390 × 844 | `<Domínio> / Mobile / <Tela> · <estado>` |
| 🧩 Components | Somente componentes principais e conjuntos de variantes | Boards nomeados por domínio, como `Lição / Cabeçalho` e `Botão` |
| 🎨 Design System | A referência visual dos tokens de `documentation/design.md` | `StarDust / Tokens · Dark & Light` |

## Regras por página

- **Desktop e Mobile** contêm apenas telas. Monte-as com instâncias dos
  componentes da página Components e desenhe um elemento como frame simples
  somente quando nenhum componente servir. As telas de autenticação ficam
  agrupadas em uma seção `Autenticação · <Tela>`, nas duas páginas.
- **Versão Mobile.** Quando uma tela já tem versão Mobile, atualize-a na mesma
  tarefa em que alterar a versão Desktop e mantenha os nomes pareados. Não crie
  versão Mobile para os estados que `documentation/design.md` exclui (estados de
  erro de autenticação, diálogos e confirmação de conta social); eles seguem os
  mesmos componentes e regras de layout. Nas telas Mobile, use a altura de
  controle de 44 px (`control-height`) como alvo de toque.
- **Diálogos** são desenhados como frames independentes, com o tamanho do
  próprio diálogo (por exemplo `Lição / Desktop / Diálogo · Vidas esgotadas`),
  nunca como uma tela inteira com backdrop.
- **Components** contém elementos reutilizáveis e nada além disso: nunca coloque
  uma tela ou um exemplo avulso nela. Extraia um elemento para esta página
  quando ele se repetir, com o mesmo propósito, três ou mais vezes nas telas.
  Use nomes em português, com `/` para a hierarquia (`Lição / Cabeçalho`), e
  propriedades e valores de variantes também em português (`Tipo`, `Estado`,
  `Tom`), como os componentes existentes. Edite o componente principal aqui,
  nunca uma instância em uma tela. Depois de editá-lo, exporte as telas que o
  usam e confira se os overrides sobreviveram, porque editar um componente
  principal pode redefinir a visibilidade ou o texto de uma instância.
- **Design System** mostra os tokens de `documentation/design.md`: cores,
  tipografia, espaçamento, raio, sombras e princípios, organizados nos conjuntos
  de tokens do arquivo (`Primitives`, `Semantic/Dark`, `Semantic/Light`,
  `Geometry`, `Story` e `Achievement`). Atualize-a na mesma tarefa sempre que
  essas fontes mudarem e vincule as amostras aos tokens para que ela nunca se
  desvie. É material de referência: não coloque telas nem componentes
  principais nesta página.
- Não crie páginas novas sem perguntar ao usuário. Uma tela sem página
  correspondente continua pertencendo a Desktop ou Mobile.
