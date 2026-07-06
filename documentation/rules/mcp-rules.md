# Regras de Uso de MCPs

## Objetivo

Os MCPs do projeto existem para acelerar leitura de contexto, validacao de
comportamento real, integracao com servicos externos e edicao assistida de
artefatos fora do codigo. Eles devem ser usados como extensoes operacionais do
trabalho, nao como substitutos de analise tecnica.

## MCPs suportados no projeto

- **Context7**: buscar documentacao atualizada de bibliotecas, frameworks,
  SDKs, APIs e CLIs.
- **Serena**: navegar a codebase com leitura semantica e localizar simbolos com
  custo menor que abrir arquivos inteiros.
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

### Serena

Use no inicio de tarefas de implementacao, investigacao ou review para localizar
simbolos, dependencias e referencias sem abrir arquivos desnecessariamente.

Boas praticas:

- prefira localizar simbolos e referencias antes de ler arquivos inteiros;
- leia apenas os corpos realmente necessarios;
- use para confirmar onde um contrato e definido e onde ele e consumido.

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
- Usar Context7 para responder pergunta sobre codigo local que Serena ou leitura
  direta resolveriam melhor.
- Usar Supabase Prod quando Dev e suficiente.
- Concluir que uma rota esta quebrada sem verificar autenticacao, redirect ou
  contexto isolado do navegador.
- Ignorar falhas de infraestrutura do MCP e seguir com conclusoes especulativas.
