# Diretrizes do Projeto

Este arquivo serve como índice para as diretrizes de documentação do projeto.
Sempre consulte os arquivos específicos abaixo com base na tarefa em questão.

## Diretrizes de Convenções de Código

**Arquivo:** `/documentation/guidelines/code-conventions-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado às convenções de código.
- Para convenções gerais de nomenclatura (variáveis, funções, classes,
  arquivos).
- Para entender o uso de Factory Functions e Objetos de Domínio (Entidades,
  Objetos de Valor, Agregados).
- Para regras sobre Barrel files (index.ts).
- Ao criar classes de Evento ou Erro.

## Diretrizes da Camada UI

**Arquivo:** `/documentation/guidelines/ui-layer-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada UI.
- Ao criar ou modificar componentes React (Widgets).
- Para entender a estrutura de um widget (View, Hook, Index).
- Para convenções de nomenclatura de Views, Hooks e Props.
- Ao implementar manipuladores de eventos ou executores de ações.
- Para entender quando usar `forwardRef`.

## Diretrizes da Camada REST

**Arquivo:** `/documentation/guidelines/rest-layer-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada REST.
- Ao realizar requisições HTTP para APIs externas ou serviços.
- Para implementar novos Services usando `RestClient`.
- Para entender como funciona `RestResponse` e o tratamento de erros nesta
  camada.

## Diretrizes da Camada RPC

**Arquivo:** `/documentation/guidelines/rpc-layer-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada RPC.
- Ao implementar Actions no servidor usando o padrão Factory Function.
- Para entender a interface `Call` e como lidar com
  requisições/redirecionamentos.
- Ao organizar actions por domínio.

## Diretrizes da Camada de Fila (queue)

**Arquivo:** `/documentation/guidelines/queue-layer-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada de fila.
- Ao implementar jobs em background ou processamento assíncrono.
- Para entender a interface `Job` e o protocolo `Amqp`.
- Ao definir novos jobs com a estrutura `Job<Payload>`.

## Diretrizes da Camada de Providers (provision)

**Arquivo:** `/documentation/guidelines/provision-layer-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada de provision.
- Ao integrar com ferramentas de terceiros (Armazenamento, Email, Pagamentos,
  etc.).
- Para implementar novos Providers (Gateways) que encapsulam SDKs externos.

## Diretrizes da Aplicação Web

**Arquivo:** `/documentation/guidelines/web-application-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a aplicação web.
- Para uma visão geral da arquitetura e stack da Aplicação Web (Next.js,
  Tailwind, etc.).
- Para entender a estrutura de pastas do projeto `apps/web`.

## Diretrizes da Aplicação Studio

**Arquivo:** `/documentation/guidelines/studio-appllication-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a aplicação studio.
- Para uma visão geral da arquitetura e stack da Aplicação Studio (Painel
  Admin - Remix, Vite, Shadcn).
- Para entender a estrutura de pastas do projeto `apps/studio`.

## Diretrizes da Camada de Banco de Dados (db)

**Arquivo:** `/documentation/guidelines/database-guidelines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada de banco de dados.
- Ao implementar persistência de dados (Repositories).
- Para entender o padrão de Mappers (conversão DB <-> Entidade).
- Ao configurar conexões ou tratar erros específicos de banco de dados.

## Diretrizes do Pacote Core (core)

**Arquivo:** `/documentation/guidelines/core-package-guideines.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado ao pacote core.
- Para entender a arquitetura de Domínio (DD Tático).
- Ao criar Entidades, Estruturas (Value Objects), Agregados e Eventos.
- Ao implementar Casos de Uso (Use Cases) e DTOs.
- Ao escrever testes unitários, Fakers ou Mocks para o domínio.

## Diretrizes de Testes de Handlers

**Arquivo:** `/documentation/guidelines/handlers-testing-guidelines.md`
**Quando consultar:**

- Ao escrever testes para Controllers (REST), Actions (RPC) ou Tools (AI).
- Para entender como mockar os objetos de contexto `Http`, `Call` e `Mcp`.
- Para seguir os padrões de orquestração e tradução de dados nos testes de
  entrada da aplicação.

## Diretrizes de Testes de Casos de Uso

**Arquivo:** `/documentation/guidelines/use-cases-testing-guidelines.md`
**Quando consultar:**

- Ao escrever testes unitários para Casos de Uso (Use Cases) no pacote core.
- Para entender como mockar repositórios e outras dependências usando
  `ts-jest-mocker`.
- Para seguir o padrão de teste de caminhos de sucesso e erros de negócio.
- Para instruções sobre o uso de Fakers para gerar dados de teste.

## Diretrizes de Testes de Widgets

**Arquivo:** `/documentation/guidelines/widget-tests-guidelines.md`
**Quando consultar:**

- Ao testar componentes React (Widgets) na camada de UI.
- Para entender a separação de testes entre Hooks e Views.
- Para utilizar funções auxiliares como `Hook()` e `View()` para testes mais
  limpos.
- Para instruções sobre testes de integração de widgets de formulário complexos.

## Diretrizes de Testes de Objetos de Domínio

**Arquivo:** `/documentation/guidelines/domain-objects-testing-guidelines.md`
**Quando consultar:**

- Ao escrever testes para Entidades, Estruturas (Structures) e Agregados.
- Para entender como usar Fakers para preparar o estado dos testes de domínio.
- Para seguir os padrões de asserção e validação de regras de negócio no
  domínio.
