# PRD — Bloco de Código

- **Módulo:** `lesson`
- **Milestone:** [#24 — Bloco de Código](https://github.com/JohnPetros/stardust/milestone/24)
- **Status:** open
- **Atualizado em:** 2026-04-07T21:36:51Z

## Definição do produto

# PRD — CodeSnippet

---

### 1. Visão Geral

O `CodeSnippet` é o componente responsável por exibir trechos de código dentro da experiência de aprendizagem, com suporte a dois modos de uso: visualização somente leitura e execução interativa.

Ele resolve a necessidade de apresentar exemplos de código com clareza em lições e desafios, e, quando aplicável, permitir que o usuário experimente o código diretamente no mesmo contexto.

Seu objetivo principal é padronizar a experiência de leitura, edição e execução de snippets educacionais, reduzindo variações entre telas e reforçando o aprendizado prático.

---

### 2. Requisitos

#### REQ-01 Exibir snippet em modo leitura

- [ ] **Exibir snippet em modo leitura**

**Descrição:** O componente deve permitir a exibição de código em contextos onde o usuário apenas consulta o conteúdo, sem alterar ou executar o snippet.

##### Regras de Negócio

- **Renderização condicionada:** O snippet só deve ser exibido quando houver conteúdo de código disponível.
- **Modo não interativo:** Quando configurado como não executável, o snippet deve permanecer somente para leitura.
- **Preservação do conteúdo inicial:** O conteúdo exibido deve refletir exatamente o código informado pelo contexto de origem.

##### Regras de UI/UX (se houver)

- **Barra de ações oculta:** No modo leitura, ações de recarregar, copiar e executar não devem ser exibidas.
- **Leitura do código:** O conteúdo deve permanecer legível e organizado por linhas.
- **Responsividade:** O snippet deve ocupar a largura disponível do container e permanecer utilizável em telas menores com rolagem quando necessário.
- **Acessibilidade:** O conteúdo deve permanecer navegável no fluxo da página sem exigir interação obrigatória.
- **Feedback:** Não há feedback interativo esperado nesse modo.
- **Performance:** A exibição deve ocorrer imediatamente após o carregamento do conteúdo.
- **Confiabilidade:** Na ausência de código, o componente não deve renderizar uma área vazia enganosa.
- **Compatibilidade:** O modo leitura deve funcionar nos contextos de lição e conteúdos associados.

#### REQ-02 Exibir snippet em modo executável

- [ ] **Exibir snippet em modo executável**

**Descrição:** O componente deve permitir edição e execução do código quando o contexto exigir prática interativa.

##### Regras de Negócio

- **Ativação explícita:** O modo executável deve depender de configuração explícita do contexto de uso.
- **Edição habilitada:** Quando executável, o usuário deve poder alterar o código antes de executá-lo.
- **Código inicial reaproveitável:** O código inicial deve servir como base para experimentação do usuário.
- **Atualização do valor:** Quando houver integração com formulário ou estado externo, alterações no código devem ser propagadas para o contexto consumidor.

##### Regras de UI/UX (se houver)

- **Barra de ações visível:** O modo executável deve expor ações de recarregar, copiar e executar.
- **Área de edição:** O editor deve permanecer disponível no mesmo bloco visual do snippet.
- **Responsividade:** O bloco deve se ajustar à largura do container mantendo a usabilidade em desktop e mobile.
- **Acessibilidade:** Os controles acionáveis devem ser acessíveis por foco e clique.
- **Feedback:** A ação de execução deve produzir retorno visível ao usuário por resultado, erro ou solicitação de entrada.
- **Performance:** A resposta à ação de execução deve ocorrer em tempo adequado ao fluxo de estudo.
- **Confiabilidade:** Falhas de execução não devem quebrar a interface do snippet.
- **Compatibilidade:** O modo executável deve funcionar nos contextos de desafios e demais superfícies que habilitem prática.

#### REQ-03 Permitir restaurar o código inicial

- [ ] **Permitir restaurar o código inicial**

**Descrição:** O usuário deve poder retornar rapidamente ao conteúdo original do snippet após alterações locais.

##### Regras de Negócio

- **Restauração sob demanda:** A ação de recarregar deve restaurar o código inicial fornecido ao componente.
- **Escopo local:** A restauração afeta apenas a sessão de edição atual do snippet.
- **Disponibilidade restrita:** A restauração só deve estar disponível no modo executável.

##### Regras de UI/UX (se houver)

- **Ação dedicada:** A restauração deve ser acionável por botão próprio na barra de ações.
- **Feedback:** O estado resultante deve deixar evidente que o conteúdo voltou ao código inicial.
- **Confiabilidade:** A restauração não deve exigir recarregamento da página.

#### REQ-04 Permitir copiar o código atual

- [ ] **Permitir copiar o código atual**

**Descrição:** O usuário deve poder copiar o conteúdo atual do snippet para uso externo ou continuação do estudo.

##### Regras de Negócio

- **Cópia do valor atual:** A ação deve copiar o estado atual do código, incluindo alterações feitas pelo usuário.
- **Disponibilidade restrita:** A cópia deve estar disponível no modo executável.
- **Dependência de suporte do ambiente:** A funcionalidade depende de suporte do ambiente do usuário à área de transferência.

##### Regras de UI/UX (se houver)

- **Ação dedicada:** A cópia deve ser acionável por botão próprio na barra de ações.
- **Feedback de sucesso:** Quando a cópia for concluída, o usuário deve receber confirmação visível.
- **Confiabilidade:** Se o ambiente não suportar cópia, a interface não deve falhar.

#### REQ-05 Executar o snippet e apresentar retorno

- [ ] **Executar o snippet e apresentar retorno**

**Descrição:** O componente deve permitir que o usuário execute o snippet e visualize o resultado da execução no próprio fluxo de aprendizagem.

##### Regras de Negócio

- **Execução sob comando do usuário:** O código só deve ser executado após ação explícita.
- **Resultado contextual:** Saídas da execução devem ser apresentadas no próprio componente.
- **Tratamento de erro:** Em caso de falha, o usuário deve receber mensagem de erro contextualizada.
- **Suporte a entrada:** Quando o snippet exigir entrada do usuário, o sistema deve solicitar esse dado antes de concluir a execução.
- **Reexecução:** Após fornecer entrada ou corrigir o código, o usuário deve poder tentar novamente.

##### Regras de UI/UX (se houver)

- **Ação principal:** O botão de executar deve ficar disponível na barra de ações do modo executável.
- **Feedback:** O componente deve apresentar saída, erro ou solicitação de entrada conforme o caso.
- **Confiabilidade:** A interface deve continuar utilizável mesmo após erros de execução.
- **Compatibilidade:** A experiência de execução deve permanecer coerente com os contextos educacionais em que o componente é usado.

#### REQ-06 Adaptar o snippet ao contexto educacional

- [ ] **Adaptar o snippet ao contexto educacional**

**Descrição:** O mesmo componente deve atender usos distintos em lições e desafios, respeitando o nível de interatividade exigido por cada contexto.

##### Regras de Negócio

- **Uso em lições objetivas:** Em perguntas e conteúdos expositivos, o snippet deve poder ser apresentado apenas como referência.
- **Uso em prática guiada:** Em contextos que incentivam experimentação, o snippet deve poder ser executável.
- **Uso em edição de desafio:** Em formulários de autoria ou edição, o snippet deve permitir edição contínua do código inicial.
- **Comportamento consistente:** A ativação de capacidades deve depender do contexto, sem alterar o propósito central do componente.

##### Regras de UI/UX (se houver)

- **Consistência entre telas:** O usuário deve reconhecer o mesmo padrão de snippet nos diferentes pontos do produto.
- **Feedback contextual:** As ações disponíveis devem refletir claramente o papel do snippet em cada tela.
- **Responsividade:** O comportamento deve permanecer funcional nas telas onde o componente já é reutilizado.

---

### 3. Fluxo de Usuário (User Flow)

**Fluxo de consulta de código em lição:** Exibição de código como apoio ao entendimento.

1. O usuário acessa uma tela de lição ou questão com trecho de código.
2. O sistema exibe o snippet em modo leitura.
3. O usuário consulta o conteúdo apresentado:
   - **Sucesso:** O usuário compreende o exemplo sem precisar interagir com o snippet.
   - **Falha:** Se não houver código disponível, o snippet não é exibido.

**Fluxo de experimentação de código:** Interação com snippet executável.

1. O usuário acessa um contexto com snippet executável.
2. O sistema exibe o editor com ações de recarregar, copiar e executar.
3. O usuário altera ou mantém o código inicial.
4. O usuário realiza uma ação:
   - **Executar:** O sistema processa o código e apresenta saída, erro ou solicitação de entrada.
   - **Copiar:** O sistema copia o código atual e confirma a ação quando possível.
   - **Recarregar:** O sistema restaura o código inicial.

**Fluxo de execução com entrada:** Execução de snippet que depende de input do usuário.

1. O usuário acessa um snippet executável que exige entrada.
2. O usuário aciona a execução.
3. O sistema valida a necessidade de entrada:
   - **Sucesso:** Solicita o dado necessário, recebe a resposta e continua a execução.
   - **Falha:** Se a entrada for cancelada, a execução é interrompida e o snippet permanece disponível para nova tentativa.

---

### 4. Fora do Escopo (Out of Scope)

- Persistência das alterações feitas pelo usuário entre sessões.
- Versionamento ou histórico de edições do snippet.
- Compartilhamento do snippet por link ou exportação estruturada.
- Personalização avançada de aparência por contexto funcional.
- Execução automática sem ação explícita do usuário
