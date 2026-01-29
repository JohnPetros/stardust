# PRD: Widget de Feedback

## 1. Visão Geral

O **Widget de Feedback** é uma ferramenta de engajamento e monitoramento de qualidade destinada a **usuários autenticados** da plataforma StarDust.

**Objetivo:** Centralizar a coleta de reportes de erros (bugs), sugestões de melhoria (ideias) e outros comentários gerais. Esta funcionalidade visa reduzir o churn por frustração técnica não reportada e criar um canal direto de escuta com a base de usuários.

**Problema:** Atualmente, não há um canal integrado na interface para que usuários reportem problemas ou sugestões no momento em que ocorrem, dificultando a identificação de bugs em produção e a coleta de insights.

---

## 2. Requisitos Funcionais

### A. Gatilho e Visibilidade
- [ ] **Botão Flutuante:** O widget deve ser acessível através de um botão discreto fixado no canto inferior direito da interface.
- [ ] **Restrição de Acesso:** O widget só deve ser exibido para usuários autenticados.

### B. Fluxo: Seleção de Tipo
- [ ] **Modal de Seleção:** Ao clicar no gatilho, abrir um modal centralizado com o título "Deixe seu feedback".
- [ ] **Opções de Tipo:** Oferecer três botões grandes e distintos para categorizar o feedback:
    - **Problema:** Ícone de lagarta (bug) verde.
    - **Ideia:** Ícone de lâmpada amarelo.
    - **Outro:** Ícone de nuvem azul.
- [ ] **Link Externo:** Exibir um link/texto discreto no rodapé "Nosso servidor do Discord" que leva à comunidade.

### C. Fluxo: Formulário de Preenchimento
- [ ] **Navegação:** Botão de "Voltar" (seta à esquerda) para retornar à seleção de tipo.
- [ ] **Contexto Visual:** O título do modal deve refletir o tipo selecionado (ex: "Problema" com o ícone correspondente).
- [ ] **Entrada de Texto:**
    - Campo de texto (textarea) obrigatório.
    - Placeholder dinâmico e amigável baseado no tipo (ex: "Algo não está funcionando bem?...", "Teve uma ideia de melhoria?...", "Queremos te ouvir...").
- [ ] **Captura de Tela (Screenshot):**
    - Botão com ícone de câmera ao lado do botão de enviar.
    - Ao clicar, acionar a captura de tela (fluxo via API do navegador `getDisplayMedia` ou similar).
    - Enquanto estiver selecionando a captura, o modal deve estar fechado.
    - Ao selecionar a captura, o modal deve ser reaberto.
    - Exibir visualização (thumbnail) da imagem capturada antes do envio, permitindo remoção.
- [ ] **Ação de Envio:** Botão "Enviar feedback" com destaque visual (cor primária do projeto).

### D. Fluxo: Sucesso
- [ ] **Feedback Imediato:** Após o envio bem-sucedido, substituir o conteúdo do modal por uma mensagem de confirmação.
- [ ] **Elementos de Sucesso:** Ícone de check verde e mensagem "Agradecemos o feedback!".
- [ ] **Novo Envio:** Botão "Quero enviar outro" que reinicia o fluxo para a etapa de seleção.
- [ ] **Fechamento:** Botão "X" no canto superior ou clique fora do modal para fechar.

### E. Processamento de Dados (Backend)
- [ ] **Persistência:** Salvar o feedback no banco de dados com:
    - Conteúdo da mensagem.
    - Tipo (bug/ideia/outro).
    - URL da screenshot (se houver).
    - ID do usuário.
    - Data/Hora.
- [ ] **Notificação (Discord):** Enviar um alerta para um canal único configurado via Webhook. A mensagem deve conter o tipo, o texto e o link da screenshot.

---

## 3. Requisitos de UI/UX

Conforme mockups fornecidos, o design deve seguir uma estética **moderna e escura (Dark Mode)**, alinhada à identidade "espacial" do StarDust.

- [ ] **Responsividade:** O modal deve se adaptar a telas menores, mantendo a usabilidade em dispositivos móveis (centralizado com margens adequadas).

---

## 4. Requisitos Não Funcionais

- [ ] **Performance:** O carregamento do widget não deve impactar o tempo de carregamento inicial da página (lazy loading se possível).
- [ ] **Segurança:** Upload de imagens deve ser restrito a formatos de imagem (png, jpg) e ter limite de tamanho para evitar abusos.
- [ ] **Confiabilidade:** Em caso de falha no envio (ex: erro de rede), exibir uma mensagem de erro amigável e permitir tentativa de reenvio sem perder o texto digitado.

---

## 5. Regras de Negócio

- **Acesso Autenticado:** Apenas usuários logados podem visualizar e enviar feedbacks. O ID do usuário deve ser vinculado automaticamente ao registro.
- **Campos Obrigatórios:** O campo de mensagem de texto é obrigatório para o envio. A captura de tela é opcional.
- **Canal Único:** Todos os tipos de feedback (Bug, Ideia, Outro) devem ser encaminhados para o mesmo canal do Discord, diferenciados visualmente na mensagem (ex: Emoji no título do embed).


