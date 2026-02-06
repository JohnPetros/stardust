# PRD: Agente Criador de Desafios

### 1. Visão Geral

O **Agente Criador de Desafios** é uma funcionalidade de backend automatizada projetada para manter o catálogo de desafios do StarDust dinâmico e engajador. Através de Jobs agendados e Inteligência Artificial, o sistema gerará novos exercícios de programação diariamente, garantindo que usuários recorrentes sempre encontrem conteúdo inédito para praticar.

**Objetivo Principal:** Eliminar a percepção de estagnação do catálogo e reduzir a dependência de curadoria manual.
**Valor Entregue:** Aumento do engajamento exploratório e oferta contínua de material de estudo prático.

### 2. Requisitos

#### Geração Automática de Desafios

**Descrição:** Mecanismo autônomo para criação e persistência de novos desafios de programação.

##### Regras de Negócio

- [ ] **Agendamento da Geração (Cron):** O sistema deve executar um Job de geração **diariamente** (uma vez a cada 24 horas).
- [ ] **Volume de Geração:** A cada execução, deve ser gerado **1 (um) único desafio**.
- [ ] **Integração com IA:** O Job deve solicitar o conteúdo ao módulo centralizado `ai` (utilizando Vercel AI SDK), fornecendo um prompt que instrua a criação de: Enunciado, Dificuldade (Fácil/Médio/Difícil), Restrições e Critérios de Validação (Testes).
- [ ] **Marcação de Novidade:** Todo desafio gerado automaticamente deve ser persistido no banco de dados com a flag `isNew` definida como `true`.
- [ ] **Persistência:** O desafio deve ser salvo no módulo `challenging` com todos os campos obrigatórios preenchidos pela resposta da IA.

#### Gestão do Ciclo de Vida da Novidade

**Descrição:** Controle temporal da flag que indica se um desafio é considerado lançamento.

##### Regras de Negócio

- [ ] **Agendamento de Limpeza (Cron):** O sistema deve executar um Job de verificação diariamente (pode ser o mesmo job de geração ou um dedicado).
- [ ] **Regra de Expiração:** O sistema deve identificar desafios onde a data de criação (`createdAt`) exceda **3 dias** e atualizar a flag `isNew` para `false`.
- [ ] **Imutabilidade Histórica:** A remoção da flag `isNew` não deve alterar ou remover o desafio do catálogo, apenas mudar seu estado visual.

#### Visualização de Novos Desafios

**Descrição:** Indicação visual para o usuário de que existem desafios frescos disponíveis.

##### Regras de UI/UX

- [ ] **Badge "Novo":** Na listagem de desafios, os cards que possuírem `isNew: true` devem exibir um badge ou etiqueta visual com o texto "Novo" (ou ícone correspondente).
- [ ] **Destaque Visual:** O badge deve utilizar uma cor de destaque (ex: cor primária ou de atenção) para diferenciar-se dos demais elementos do card.
- [ ] **Sem Notificação Ativa:** Não deve ser enviada notificação por push, e-mail ou central de notificações; a descoberta é passiva ao navegar pela lista.

### 3. Fluxo de Usuário (User Flow)

**Fluxo: Descoberta de Novo Desafio**

1. O usuário acessa a página de **Desafios** (`/challenges`).
2. O sistema carrega a lista de desafios disponíveis.
3. O usuário visualiza cards de desafios.
4. O sistema valida a propriedade `isNew`:
   - **Verdadeiro:** O card exibe o badge "Novo" em destaque.
   - **Falso:** O card é exibido normalmente, sem destaque.
5. O usuário clica no card para iniciar o desafio.

### 4. Fora do Escopo (Out of Scope)

- **Personalização:** Geração de desafios baseada no nível ou histórico específico do usuário.
- **Streak/Gamificação Extra:** Integração da geração com sistemas de ofensiva ou recompensas especiais (além do XP padrão).
- **Notificações Ativas:** Envio de e-mails ou push notifications avisando sobre o novo desafio.
- **Revisão Humana:** Interface para aprovação manual dos desafios antes da publicação.
- **Edição de IA:** Capacidade de regenerar um desafio específico se ele for "ruim".
