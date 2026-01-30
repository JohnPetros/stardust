# PRD: Gerenciamento de Relatórios de Feedback

## 1. Visão Geral

Este documento detalha os requisitos para a funcionalidade de **Gerenciamento de Relatórios de Feedback** no aplicativo **StarDust Studio**. 

O objetivo é fornecer aos administradores e equipe de produto uma interface centralizada para visualizar, analisar e gerenciar os feedbacks enviados pelos usuários (bugs, ideias ou outros), facilitando a identificação de problemas e oportunidades de melhoria na plataforma.

**Público-alvo:** Administradores do sistema, Gerentes de Produto, Equipe de Suporte/QA.

---

## 2. Requisitos Funcionais

### A. Tabela de Listagem de Feedbacks

Componente principal para visualização dos relatórios de feedback cadastrados no sistema.

**Funcionalidades:**
- [ ] **Listagem de Dados:** Exibir os relatórios de feedback em formato de tabela.
- [ ] **Filtros de Busca:**
  - **Por Autor (Nome):** Campo de texto para buscar pelo nome do usuário.
  - **Por Tipo (Intent):** Seletor (Dropdown) para filtrar por Bug, Ideia ou Outro.
  - **Por Data (Range):** Seletor de período (Data Inicial - Data Final) para filtrar feedbacks enviados em um intervalo específico.
- [ ] **Colunas Obrigatórias:**
  - **Autor:** Exibir Avatar e Nome do usuário que enviou o feedback.
  - **Tipo (Intent):** Exibir o tipo de feedback (Bug, Ideia, Outro) com identificação visual (badge/ícone).
  - **Data de Envio (SentAt):** Data e hora formatada do envio.
  - **Preview:** Miniatura da captura de tela (se houver) ou resumo do texto.
- [ ] **Paginação:** Permitir navegação entre páginas de resultados.
- [ ] **Ações por Linha:**
  - Botão para visualizar detalhes (abre Dialog).
  - Botão para deletar o relatório.
- [ ] **Estado Vazio:** Exibir mensagem amigável quando não houver registros.

### B. Dialog de Detalhes do Feedback

Modal para visualização completa das informações de um relatório específico.

**Funcionalidades:**
- [ ] **Exibição de Informações:**
  - Dados completos do Autor (Nome, possivelmente Email/ID).
  - Data e hora exata do envio.
  - Tipo do feedback em destaque.
  - Conteúdo textual completo da mensagem do usuário.
- [ ] **Visualização de Screenshot:**
  - Exibir a captura de tela em tamanho legível.
  - Opcional: Permitir clique para expandir/zoom (lightbox/nova aba).
- [ ] **Ações:**
  - Botão "Fechar" para retornar à listagem.
  - Botão "Deletar" para remover o registro (com confirmação).

---

## 3. Requisitos Não Funcionais

- [ ] **Performance:** 
  - O carregamento da lista deve ocorrer em menos de 2 segundos.
  - Imagens (screenshots) devem ser carregadas de forma otimizada (lazy loading/thumbnails na tabela).

- [ ] **Segurança:**
  - Acesso restrito a usuários autenticados e autorizados no StarDust Studio.
  - Ação de deletar deve exigir confirmação para evitar perdas acidentais.

- [ ] **Usabilidade:**
  - Interface responsiva, adaptando-se a diferentes resoluções de desktop.
  - Feedback visual imediato ao deletar um item (toast de sucesso/erro).

---

## 4. Regras de Negócio

- **Delete Lógico/Físico:**
  - A ação de deletar remove o relatório permanentemente da visualização. (Confirmar se é soft delete ou hard delete com backend - assumir hard delete por padrão para "limpeza").

- **Formatação de Data:**
  - As datas devem ser exibidas no formato local do usuário (ex: `dd/MM/yyyy HH:mm`).

- **Tratamento de Imagens:**
  - Se o feedback não possuir screenshot, a coluna de preview deve exibir um placeholder ou texto indicativo ("Sem imagem").
  - Na visualização detalhada, a ausência de imagem deve ser tratada visualmente sem quebrar o layout.

---

## 5. Requisitos de UI/UX

- [ ] **Componentes Base:** Utilizar componentes do Design System existente (Shadcn UI + Tailwind):
  - `Table`, `TableRow`, `TableCell` para a listagem.
  - `Dialog`, `DialogContent`, `DialogHeader` para o detalhe.
  - `Avatar`, `AvatarImage`, `AvatarFallback` para o autor.
  - `Badge` para o Tipo (Intent) - Cores sugeridas: 
    - Vermelho/Laranja para Bug
    - Verde/Azul para Ideia
    - Cinza para Outro
  - `Button` com variantes (ghost para ações na tabela, destructive para deletar).
  - `Input` para filtro de nome.
  - `Select` ou `Combobox` para filtro de Intent.
  - `DatePickerWithRange` para filtro de datas.

- [ ] **Ícones:** Utilizar biblioteca de ícones padrão do projeto (Lucide React) para ações (Olho para visualizar, Lixeira para deletar).
