# Prompt: Implementar Spec

**Objetivo:** Executar o plano de implementação técnica de forma iterativa,
organizada e validada, garantindo qualidade e integração contínua.

**Entrada:**

- Documento de Spec técnica aprovado/finalizado.

**Regras de Execução:**

## REGRA MESTRA (NÃO IGNORE)

Antes de gerar qualquer linha de código ou resposta técnica, você deve executar
o seguinte algoritmo mental:

1. **Classificar:** Qual é a natureza da tarefa? (ex: UI, Banco de Dados, RPC,
   Testes).
2. **Consultar o Índice:** Olhe para o arquivo `# Regras do Projeto`
   (index).
3. **Verificar Contexto:** O arquivo específico indicado no índice está
   carregado no meu contexto atual?
   - [SIM] -> Prossiga e cite qual regra específica você está aplicando.
   - [NÃO] -> PARE IMEDIATAMENTE. Solicite ao usuário: "Por favor, adicione o
     arquivo [caminho_do_arquivo] ao contexto para que eu possa seguir as
     regraes de [Nome da Camada]."

## PROIBIÇÕES

- NUNCA assuma padrões de arquitetura genéricos (ex: Clean Arch padrão, MVC
  padrão) sem ler o arquivo de regra específico do projeto.
- NUNCA gere código baseado apenas no resumo do arquivo de índice.

1. **Validação de Regras e Arquitetura:** Antes de iniciar a implementação,
   certifique-se de que compreende as regraes (de acordo com a spec) e a
   estrutura do projeto:
   - **Padronização de Código:**
     `documentation/rules/code-conventions-rules.md`
   - **Regras por Camada:**
     - **Core (Domínio):** `documentation/rules/core-package-rules.md`
     - **UI (Widgets & Design):**
       `documentation/rules/ui-layer-rules.md`
     - **REST (Integrações HTTP):**
       `documentation/rules/rest-layer-rules.md`
     - **RPC (Server Actions):**
       `documentation/rules/rpc-layer-rules.md`
     - **Queue (Background Jobs):**
       `documentation/rules/queue-layer-rules.md`
     - **Database (Persistência):**
       `documentation/rules/database-rules.md`
   - **Padrões de Testes:** `documentation/rules/unit-tests-rules.md`

2. **Decomposição Atômica:**
   - Divida o plano macro em micro-tarefas atômicas.
   - Cada tarefa deve resultar em um código compilável e funcional isoladamente.

3. **Ordem de Execução (Bottom-Up):** Implemente as tarefas seguindo
   rigorosamente a hierarquia de dependências:
   1. **Core:** DTOs, Entidades e Interfaces.
   2. **Drivers/Infra:** Implementações de repositórios e gateways (ex:
      Supabase, Inngest).
   3. **API Layers:** Implementações de Actions (RPC) ou Controllers (REST).
   4. **Interface de Usuário:** Widgets e Páginas.
   - **Regra:** Nunca implemente um componente consumidor (ex: Widget/Page)
     antes de implementar a lógica/dados que ele consome.

4. **Ciclo de Qualidade e Verificação (Por Tarefa):** Ao finalizar a codificação
   de _cada micro-tarefa_, execute os passos de validação ANTES de passar para a
   próxima:
   - **Formatação e Lint:** Execute `npm run codecheck` para garantir
     conformidade e formatação.
   - **Typecheck:** Execute `npm run typecheck` para garantir que o código seja
     válido com relação a tipagem.
   - **Testes:** Execute `npm run test` para validar a lógica implementada
   - **Contexto de Monorepo:** O comando deve ser executado **dentro do
     diretório da aplicação ou pacote específico** (onde reside o
     `package.json`, ex: `apps/web` ou `packages/core`), e não na raiz do
     workspace.
   - **Critério de Aceite:** Corrija imediatamente quaisquer erros do linter ou
     testes falhando. Não avance com código "quebrado".

5. **Uso de Ferramentas Auxiliares:**
   - **MCP Serena**: utilize o MCP do Serena para facilitar sua busca pelo
     projeto.
   - **MCP Context7:** Caso tenha dúvidas sobre como usar uma biblioteca
     específica (ex: `shadcn/ui`, `radix-ui`, `inngest`, `supabase`), utilize o
     MCP do Context7 para obter documentação e exemplos de uso.

6. **Planejamento e Tarefas:**
   - Caso tenha sido realizado o planejamento e a definição de tarefas prévias,
     leve-as em consideração durante a implementação.

7. **Consistência de Padrões:**
   - **Camada UI:**
     - Todo widget deve seguir a estrutura de Widget: `Index` (.tsx), `View`
       (.tsx) e `Hook` (.ts).
     - Evite lógica de negócio na View.
     - Prefira dividir o widget em widgets menores para melhorar a reutilização
       e a manutenção do código.
     - Se precisar criar um widget interno, siga a estrutura de Widget: `Index`
       (.tsx), `View` (.tsx) e `Hook` (.ts) também
     - Funções dentro de hooks devem usar a notação function em vez de arrow
       functions, exceto em casos específicos como useCallback.
     - **Importante:** Utilize `Tailwind CSS` e primitivos do `Radix UI` (ou
       componentes `shadcn` existentes), evitando estilos inline ou bibliotecas
       não aprovadas como Material UI.
