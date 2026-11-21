# Regras do Canvas de Design (Doop)

Este documento define a propriedade das páginas, a nomenclatura de frames e a
colocação de componentes no canvas `StarDust` do Doop
(https://doop.design/c/iTvx3bvEsu). Ele complementa
`documentation/rules/mcp-rules.md` (uso do Doop MCP) e
`documentation/design.md` (referências aprovadas e tokens).

## Páginas do canvas

O canvas `StarDust` organiza os frames em páginas, cada uma com uma função. Coloque
cada frame na página que é dona dele e consulte os IDs das páginas pelo Doop MCP
(`get_canvas`) em vez de fixá-los.

| Página     | Contém                                                           | Nome dos frames                                                                                                                         |
| ---------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop    | Telas desktop completas, 1440 de largura (1440 × 900 por padrão) | `<Módulo> / <Página> / <Componente> / <Estado ou variante> / Desktop`                                                                   |
| Mobile     | A versão mobile das telas do Desktop, 390 × 844                  | `<Módulo> / <Página> / <Componente> / <Estado ou variante> / Mobile`                                                                    |
| Components | Somente os componentes principais (mains)                        | Um frame por componente, com o nome do componente, como `LessonHeader` e `Button`, mais frames de catálogo como `Blocos de programação` |

O frame `StarDust / Tokens · Dark & Light` é a referência visual dos tokens de
`documentation/design.md`.

## Nome dos frames de tela

O nome de um frame das páginas Desktop e Mobile tem até cinco segmentos, nesta
ordem, separados por `/`:

1. **Módulo:** o nome em português do módulo do produto (`Espaço`, `Lição`,
   `Autenticação`).
2. **Página:** a página da aplicação (`Galáxias`, `Sign-in`).
3. **Componente:** a parte da página que o frame desenha, quando ele não é a
   página inteira (`Diálogo`).
4. **Estado ou variante:** o estado desenhado, quando não é o padrão
   (`carregando`, `falha ao carregar`).
5. **Viewport:** `Desktop` ou `Mobile`, sempre o último segmento.

- Módulo, página e viewport são obrigatórios. Omita o componente e o estado
  quando não se aplicam: `Espaço / Galáxias / Desktop` é a página inteira no
  estado padrão e `Espaço / Galáxias / carregando / Mobile` é o estado de
  carregamento.
- As versões Desktop e Mobile do mesmo frame diferem apenas no último segmento.
- **Migração.** A regra vale desde 2026-11-14. Os frames anteriores seguem o
  padrão `<Domínio> / <Desktop|Mobile> / <Tela> · <estado>` e são renomeados
  quando uma tarefa os alterar, junto com as referências em Specs, PRDs e
  registros de revisão. Não renomeie frames que a tarefa não toca.

## Regras por página

- **Desktop e Mobile** contêm apenas telas. Monte-as com instâncias dos
  componentes (`<doop-use>`) listados por `list_components` e desenhe um elemento
  como HTML simples somente quando nenhum componente servir. As telas de
  autenticação ficam agrupadas sobre um frame de fundo `Autenticação · <Tela>`,
  nas duas páginas.
- **Agrupamento.** Um frame de fundo (`<Área> · <Tópico>`, com
  `background: var(--color-neutral-700)`) agrupa as telas de um tópico. Crie-o
  antes das telas que ele agrupa, porque um frame criado depois renderiza por cima.
  Dê às telas as coordenadas do fundo mais a margem, sem somar a margem duas vezes.
- **Versão Mobile.** Quando uma tela já tem versão Mobile, atualize-a na mesma
  tarefa em que alterar a versão Desktop e mantenha os nomes pareados. Não crie
  versão Mobile para os estados que `documentation/design.md` exclui (estados de
  erro de autenticação, diálogos e confirmação de conta social); eles seguem os
  mesmos componentes e regras de layout. A única exceção é
  `Espaço / Galáxia / Diálogo de vídeo de apresentação / Mobile`, que prova que o
  diálogo de vídeo do planeta cabe na largura mobile (RP-10 de `galaxy-page-prd.md`);
  os demais estados desse diálogo e o diálogo do vídeo de encerramento o seguem em
  mobile. Nas telas Mobile, use a altura de
  controle de 44 px (`--spacing-control-height`) como alvo de toque.
- **Diálogos** são desenhados como frames independentes, com o tamanho do
  próprio diálogo e o corpo transparente (por exemplo
  `Lição / Desktop / Diálogo · Energia esgotada`), nunca como uma tela inteira
  com backdrop.
- **Components** contém elementos reutilizáveis e nada além disso: nunca coloque
  uma tela ou um exemplo avulso nela. Extraia um elemento para um componente
  quando ele se repetir, com o mesmo propósito, três ou mais vezes nas telas, e
  nunca redesenhe um elemento que já está em `list_components`. Use nomes em
  PascalCase em inglês, como os componentes existentes (`LessonHeader`,
  `TrailCard`), e props e valores de variantes em minúsculas (`state`, `tone`,
  `size`). Edite o componente principal com `update_component`, nunca uma
  instância em uma tela. Antes de editar um componente com muitas instâncias,
  rode `update_component` com `dry_run` para ler o impacto; depois, capture
  (`get_frame_screenshot`) as telas que o usam e confira se as props e os
  overrides sobreviveram, porque a edição se propaga a todas as instâncias.
  Quando o novo desenho for só uma variação, acrescente uma prop de variante em
  vez de criar outro componente.
- **Tokens** são os do canvas (`get_tokens`):
  cores (`--color-*`), espaçamento (`--spacing-*`), raio (`--radius-*`),
  tipografia e sombras, com o valor do tema `light` quando difere. Use sempre
  `var(--token)` nas telas e nos componentes, nunca um hexadecimal avulso, e
  atualize o frame `StarDust / Tokens · Dark & Light` na mesma tarefa em que
  `documentation/design.md` ou os tokens mudarem. É material de referência: não
  coloque telas nem componentes principais nele.
- Não crie páginas novas sem perguntar ao usuário. Uma tela sem página
  correspondente continua pertencendo a Desktop ou Mobile.

## Registros de revisão de design

- Cada PRD com frames revisados tem um registro em
  `documentation/design-reviews/<módulo>/<slug-do-prd>.md`, com o mesmo nome do
  arquivo do PRD. Ele é escrito em inglês pelos workflows `design` e
  `review-design` (`documentation/prompts/design-prompt.md` e
  `review-design-prompt.md`), que definem o formato do frontmatter e das seções.
- Grave ou atualize o registro somente depois da última correção nos frames, com
  o `doop_updated_at` e o `updated_at` de cada frame vindos de `get_frame`. Não edite
  esses valores à mão.
- Qualquer alteração em um frame revisado ou no `last_updated_at` do PRD torna o
  registro desatualizado; ele volta a valer só depois de uma nova revisão por
  `design` ou `review-design`.
- O registro guarda findings resolvidos e decisões, não o relatório bruto do
  Design Reviewer.
