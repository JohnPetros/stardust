# Regras de Uso de MCPs

## Objetivo

Os MCPs do projeto existem para acelerar leitura de contexto, validacao de
comportamento real, integracao com servicos externos e edicao assistida de
artefatos fora do codigo. Eles devem ser usados como extensoes operacionais do
trabalho, nao como substitutos de analise tecnica.

## MCPs suportados no projeto

- **Context7**: buscar documentacao atualizada de bibliotecas, frameworks,
  SDKs, APIs e CLIs.
- **CodeGraph**: explorar simbolos, caminhos de chamada e impacto de mudancas
  na codebase indexada.
- **Penpot**: inspecionar e editar o arquivo Penpot `stardust`, exportar
  imagens de boards, ler componentes e tokens e validar layout.
- **Pencil**: ler e editar arquivos `.pen`, validar layout e trabalhar com
  contexto de design.
- **Supabase Dev**: inspecionar e operar o ambiente de desenvolvimento do
  Supabase.
- **Supabase Prod**: inspecionar o ambiente de producao do Supabase com cuidado
  extra.
- **Playwright MCP**: validar fluxos reais de navegador, navegacao,
  autenticacao, scroll, formularios e regressao visual/interativa.

## Regras gerais

- Sempre escolha o MCP mais especifico para a tarefa antes de recorrer a shell
  ou web search genérico.
- Nao use MCP quando a resposta pode ser obtida de forma mais simples e segura
  pelo proprio codebase local.
- Nao assuma que o MCP esta pronto para uso: confirme pre-requisitos do
  ambiente quando a ferramenta depende de binarios, servicos locais, sessao ou
  credenciais.
- Trate a saida do MCP como evidencia operacional. Ainda e necessario
  interpretar o resultado com base na arquitetura e nas regras do projeto.
- Quando o MCP revelar falha de infraestrutura ou ambiente, registre isso
  explicitamente em vez de concluir incorretamente que o bug esta no codigo.

## Quando usar cada MCP

### Context7

Use quando a tarefa depender de documentacao atualizada e houver risco de
desvio por informacao desatualizada.

Use para:

- sintaxe e contratos de bibliotecas;
- opcoes de configuracao;
- migracoes de versao;
- comportamento atual de ferramentas externas.

Nao use como fonte principal para explicar o proprio codebase do projeto.

### CodeGraph

Use antes de ler ou editar codigo quando precisar entender simbolos, fluxos,
arquitetura, bugs ou o impacto de uma mudanca. A exploracao retorna codigo-fonte,
caminhos de chamada e raio de impacto.

Boas praticas:

- consulte simbolos ou arquivos relevantes em uma exploracao;
- trate o codigo retornado como leitura atual e nao repita a busca com `grep` ou
  leitura dos mesmos arquivos;
- use leitura direta para arquivos fora do indice ou detalhes que a exploracao
  nao mostrou;
- se o projeto nao estiver indexado, use as ferramentas locais de navegacao e
  leitura; nao inicialize o indice sem solicitacao.

### Penpot

Use para inspecionar ou editar o arquivo Penpot `stardust`, a fonte visual
canonica do projeto. O MCP so funciona com o arquivo aberto no navegador e o
plugin Penpot MCP carregado e conectado a ele.

Boas praticas:

- leia `high_level_overview` uma vez por sessao e consulte `penpot_api_info`
  antes de usar `execute_code`;
- confirme com `penpot.currentFile.name` que o arquivo conectado e `stardust`;
  o servidor MCP pode estar ligado a outro arquivo Penpot;
- localize paginas e boards por nome (`penpot.currentFile.pages`,
  `penpotUtils.findShapes`); o nome e o contrato e IDs mudam se o board for
  recriado;
- leia a estrutura, os componentes (`penpot.library.local`) e os tokens antes
  de deduzir cores, medidas ou componentes;
- use `export_shape` apenas quando validacao visual for necessaria;
- ao editar, use os componentes e tokens da biblioteca, nao altere
  componentes da biblioteca sem pedido e confira o resultado com
  `export_shape`; o Penpot salva automaticamente;
- o sandbox do `execute_code` nao tem `fetch`; envie dados inline e nao dependa
  de servidores locais.

### Pencil

Use somente para arquivos `.pen` ou quando a tarefa exigir contexto real de
design do editor.

Boas praticas:

- obtenha primeiro o estado/schema atual do editor;
- use screenshot apenas quando validacao visual for necessaria;
- prefira validacao estrutural quando o objetivo for layout ou hierarquia.

### Supabase Dev e Supabase Prod

Use para verificar schema, logs, configuracao e dados relacionados ao fluxo
investigado.

Boas praticas:

- comece por inspecao antes de alterar qualquer coisa;
- prefira `Dev` por padrao;
- use `Prod` apenas quando a pergunta exigir o estado real de producao;
- em producao, evite operacoes mutativas sem necessidade objetiva e evidencia.

### Playwright MCP

Use quando a mudanca tocar comportamento visual ou interativo real:

- paginas autenticadas;
- navegacao;
- formularios;
- scroll;
- modais e drawers;
- regressao de layout;
- comportamento do browser que teste unitario nao cobre bem.

## Regras especificas para o Playwright MCP

### Pre-requisitos

Antes de abrir a pagina:

- confirme que o app correto esta rodando na porta esperada;
- confirme que o binario exigido pelo MCP existe no host;
- confirme que a URL responde sem erro estrutural;
- confirme se a rota exige autenticacao.

### Sessao e autenticacao

- O navegador do MCP usa contexto isolado. Login manual no navegador local do
  usuario nao implica sessao autenticada no Playwright.
- Para rotas autenticadas, autentique dentro do proprio MCP ou injete a sessao
  explicitamente.
- Quando for necessario autenticar no ambiente atual para validar paginas
  protegidas, use as credenciais informadas pelo usuario neste projeto:
  `ctrlaltdel.cursor@gmail.com` / `123456`.
- Se a rota protegida redirecionar para login, nao trate isso como bug da tela
  alvo sem antes validar ausencia de sessao.

### Validacao correta

- Nao confie apenas na URL final. Capture snapshot, console e, quando fizer
  sentido, screenshot.
- Diferencie erro de produto de erro de ambiente. Exemplo: assets `404`,
  processo incorreto na porta, sessao ausente, server quebrado.
- Quando medir bugs de scroll ou viewport, colete dimensoes reais do container
  rolavel e do elemento alvo no contexto do browser.
- Quando o fluxo depender de animacao, lazy-load ou layout tardio, aguarde
  estado estavel antes de concluir que o comportamento esta correto.

### Limites

- Warnings de console so importam quando afetam diretamente o fluxo validado.
- Erros auxiliares em requests paralelos devem ser registrados, mas nao devem
  invalidar a conclusao principal sem nexo causal claro.
- Se o MCP falhar por infraestrutura, documente a causa exata e a etapa que
  ficou pendente.

## Ordem recomendada de uso

1. Confirmar o objetivo e o tipo de validacao necessario.
2. Escolher o MCP apropriado.
3. Verificar pre-requisitos de ambiente.
4. Executar a leitura ou validacao.
5. Registrar evidencias observadas.
6. Separar problema de ambiente, problema de dados e problema de codigo.

## Anti-padroes

- Usar Playwright para tentar provar bug de UI sem app rodando corretamente.
- Usar Context7 para responder pergunta sobre codigo local que CodeGraph ou
  leitura direta resolveriam melhor.
- Usar Supabase Prod quando Dev e suficiente.
- Concluir que uma rota esta quebrada sem verificar autenticacao, redirect ou
  contexto isolado do navegador.
- Ignorar falhas de infraestrutura do MCP e seguir com conclusoes especulativas.
