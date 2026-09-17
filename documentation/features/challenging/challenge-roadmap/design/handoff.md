# Challenge Roadmap — design handoff

## Autoridade e inventário

- Fonte canônica: `design/stardust.pen`.
- Ordem de precedência: PRD e decisões aprovadas no Grilling definem comportamento;
  os nodes Pencil definem composição visual; tokens/componentes existentes da Web
  definem extensões para estados sem frame próprio.
- O design foi alinhado em 2026-09-16: removidos os nós `Funções` e `Algoritmos`,
  atualizados os totais para a curadoria de 20 desafios e substituído o drawer
  legado por busca + dificuldade + conclusão, sem paginação.

| Node | Nome | Estado/variante | Viewport de referência | Screenshot | RF/CA/VM |
| --- | --- | --- | --- | --- | --- |
| `GJpSw` | `Challenge Roadmap - Overview` | conteúdo, drawer fechado, usuário autenticado com progresso parcial | 1440 × 1024 | `GJpSw.png` | RF-01..06, RF-10; CA-01..09, CA-22; VM-01 |
| `b081p` | `Challenge Roadmap - Category Drawer` | conteúdo, nó Operadores selecionado, drawer aberto, busca/filtros visíveis | frame 1854 × 1024; superfície principal 1440 × 1024 | `b081p.png` | RF-07..09, RF-11; CA-10..16, CA-22; VM-02 |

As imagens são snapshots offline; IDs, nomes, árvore e propriedades do arquivo
`.pen` permanecem a autoridade visual. O conteúdo dinâmico pode mudar, mas a
estrutura, hierarquia e densidade não.

## Anchors visuais

### `GJpSw`

- Frame 1440 × 1024, fundo `gray-950`, cabeçalho entre x=80 e x=1360, com título,
  subtítulo e switch `Roadmap | Todos os desafios`.
- Grafo ocupa a área principal; nós usam cartões de 190 × 76, borda/realce verde,
  nome, barra de progresso e fração concluída/total.
- DAG canônico: Básico → Textos/Números/Operadores; Textos → Lógicos;
  Números+Operadores → Condicionais; Operadores → Listas;
  Lógicos+Condicionais+Listas → Laços.
- Card de resumo em x=1038, y=132, 322 × 176, com percentual, `7 de 20 desafios
  concluídos`, próxima recomendação e CTA.
- Controls do mapa ficam no canto inferior esquerdo; legenda/ajuda no rodapé.

### `b081p`

- Preserva a composição do overview sob scrim.
- Drawer direito em x=860, y=108, 500 × 892 dentro da superfície principal,
  com padding 28 e largura interna de 444.
- Ordem: título/descrição/fechar; barra `1 de 2 concluído`; heading; busca;
  selects de dificuldade e conclusão; lista completa sem paginação.
- Linhas têm 444 × 66, status circular, título, dificuldade/estado e affordance de
  abertura. A referência usa `Perímetro espacial` concluído e `Resistências em
  circuitos` recomendado.
- O drawer fecha por botão, `Escape` e scrim, restaura foco no nó e mantém o nó na
  URL.

## Crosswalk de tokens e componentes

| Papel | Pencil | Implementação esperada |
| --- | --- | --- |
| Fundo | `$gray-950` `#0b0e0f` | token Tailwind/design-system equivalente |
| Superfície | `$gray-900`/`$gray-800` | surface/card/drawer existentes |
| Texto | `$gray-100`..`$gray-400` | escala de texto existente |
| Ação/seleção | `$green-400` `#00ff88`, `$green-500` `#0fe983` | tokens green do projeto |
| Borda secundária | `$gray-600`/`$gray-700` | border tokens existentes |
| Tipografia UI | `$font-ui` = Funnel Sans | fonte global da Web |
| Legendas | `$font-caption` = Geist Mono | mono/caption existente |
| Raios | `$radius-sm/md/lg` = 4/8/12 | utilities equivalentes |
| Grafo | arestas e cartões do node | `@xyflow/react` com node customizado, Background, Controls e MiniMap apenas se preservar a composição |
| Drawer e filtros | composição Pencil | primitives acessíveis existentes de Drawer/Input/Select/Button |

Não introduzir cores, fontes, sombras ou ícones alternativos quando já houver
token/componente correspondente. Ícones devem usar o componente `Icon` existente;
controles do React Flow devem receber rótulos em português e o mesmo tratamento
visual da referência.

## Receitas de layout, responsividade e acessibilidade

- Desktop ≥ 1024 px: mapa e resumo coexistem; drawer lateral não desloca o canvas.
- Mobile 390 × 844: preservar cabeçalho e switch, oferecer representação linear
  como modo primário acessível e drawer em painel de largura/tela inteira. O canvas
  pode permanecer como alternativa pan/zoom, sem exigir gesto fino para alcançar
  qualquer categoria.
- Nós são focáveis e ativados por Enter/Espaço; arestas não precisam ser focáveis.
  Desabilitar arraste/conexão/remoção e manter pan/zoom/fit-view.
- O modo linear segue ordem topológica e explicita pré-requisitos, progresso e
  recomendação em texto; não é uma lista visual inventada paralela.
- Drawer usa título associado, foco contido, fechamento por Escape/scrim/botão e
  restauração do foco. Resultados e erros assíncronos usam live region apropriada.
- Alvos interativos têm no mínimo 44 × 44 no mobile; não depender apenas de cor
  para conclusão, elegibilidade ou recomendação.

## Extensões aprovadas sem node canônico

Não existem frames Pencil próprios para mobile, loading, erro, vazio, visitante,
conclusão total ou nó `Em breve`. Esses estados devem estender a mesma composição e
os componentes compartilhados, sem criar nova linguagem visual:

- loading: skeletons que preservam os anchors do header, resumo e nós/lista;
- erro do snapshot: feedback de página com retry, sem grafo parcialmente confiável;
- erro do drawer: feedback e retry somente no drawer, preservando mapa e seleção;
- vazio de revisão: estado seguro, sem recomendação e com acesso ao catálogo;
- visitante: totais editoriais visíveis, progresso/recomendação pessoal ocultos e
  CTA neutro; desafios públicos continuam acessíveis;
- conclusão total: 100%, mensagem de conclusão e ausência de próximo desafio;
- `Em breve`: nó terminal, não interativo para desafio, com explicação textual.

Essas extensões são validadas em 1440 × 1024 e 390 × 844. Ausência de frame não
autoriza simplificar os nodes `GJpSw`/`b081p` nem mudar a hierarquia canônica.

## Comparação esperada

- Pencil: reabrir `design/stardust.pen`, inspecionar `GJpSw` e `b081p`, confirmar
  dimensões, árvore e ausência de clipping/overflow.
- Web: screenshots do runtime em 1440 × 1024 para overview e drawer; comparar
  anchors principais com tolerância de 4 px, exceto conteúdo dinâmico explicitado.
- Web mobile: screenshots 390 × 844 dos estados conteúdo/drawer e verificação de
  reflow, safe area, scroll, foco e alvos de toque.
- Registrar separadamente diferenças de dado dinâmico, diferenças responsivas
  aprovadas e qualquer divergência de layout. Divergência estrutural não aprovada
  bloqueia a entrega.
