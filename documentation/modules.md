# Visão Geral do Projeto StarDust

StarDust é uma plataforma web focada no ensino de lógica de programação, utilizando uma abordagem gamificada e uma metáfora espacial para engajar os usuários. Inspirado no modelo do Duolingo, o sistema guia os estudantes através de uma jornada intergaláctica onde o aprendizado se traduz em progresso exploratório.

## Arquitetura Modular

O sistema adota uma arquitetura modular paracom o objetivo de promover organização, escalabilidade e manutenibilidade. A aplicação é dividida em unidades independentes chamadas **módulos**, onde cada um encapsula uma lógica de domínio específica.

Atualmente, o StarDust é composto por **nove módulos de domínio**, além de um módulo transversal de recursos compartilhados.

## Módulos do Sistema

### 1. Global (`global`)
Diferente dos demais, este módulo não é isolado. Ele centraliza interfaces, componentes de UI, utilitários e recursos compartilhados acessíveis por todo o sistema, funcionando como a base comum da aplicação.

### 2. Autenticação (`auth`)
Gerencia a segurança e o controle de acesso. Responsável por:
- Autenticação e autorização de usuários.
- Gestão de tokens de sessão e permissões.
- Proteção de rotas e recursos restritos.

### 3. Progresso Espacial (`space`)
O "coração" da jornada do usuário. Gerencia a estrutura de aprendizado baseada na metáfora espacial:
- **Planetas**: Representam grandes temas de lógica de programação (ex: Variáveis, Laços).
- **Estrelas**: Representam subtópicos ou fases dentro de cada tema.
- **Sistema de Bloqueio**: Garante a progressão linear, onde novas fases só são liberadas após a conclusão das anteriores.

### 4. Lição (`lesson`)
Gerencia o conteúdo educacional teórico e interativo dentro das fases.
- **Narrativa**: Apresenta conceitos teóricos através de histórias.
- **Quizzes**: Avalia o aprendizado com perguntas interativas.
- **Feedback**: Fornece métricas de desempenho (precisão, tempo, XP) ao final de cada lição.

### 5. Desafio (`challenging`)
Foca na prática deliberada de programação.
- **Desafios Livres**: Exercícios de codificação independentes da trilha principal.
- **Filtros**: Permite buscar desafios por dificuldade, tema ou estado de conclusão.
- **Autonomia**: Permite que o usuário pratique tópicos específicos conforme sua necessidade.

### 6. Playground
Um ambiente de desenvolvimento livre (sandbox) integrado.
- Permite a escrita e execução de código sem as restrições de um desafio específico.
- Serve como ferramenta para experimentação e reforço da criatividade.

### 7. Perfil (`profile`)
Centraliza as informações do usuário e suas métricas de longo prazo.
- **Conquistas**: Sistema de medalhas para premiar marcos importantes.
- **Streak (Ofensiva)**: Monitora a consistência de estudo diário (sequência de dias).
- **Dados Pessoais**: Gestão de informações da conta.

### 8. Loja (`shop`)
Adiciona uma camada extra de gamificação através de economia virtual.
- **Moedas (`starcoins`)**: Moeda virtual ganha ao completar atividades.
- **Itens Cosméticos**: Compra de avatares e modelos de foguetes para personalização.
- **Personalização**: Permite que o usuário expresse sua identidade visual na plataforma.

### 9. Ranqueamento (`ranking`)
Estimula a competição saudável e o engajamento contínuo.
- **Sistema de Tiers (Divisões)**: Agrupa usuários em ligas baseadas no XP semanal.
- **Promoção e Rebaixamento**: Mecanismo dinâmico que sobe ou desce usuários de divisão ao final de cada ciclo semanal.
- **Recompensas**: Prêmios baseado no desempenho e prestígio da divisão.

### 10. Fórum (`forum`)
Promove a comunidade e a aprendizagem social.
- Espaço para dúvidas, discussões sobre desafios e interação geral entre os estudantes.

### 11. Manual (`manual`)
Gerencia o sistema de documentação e guias da plataforma.
- **Guias (`Guide`)**: Criação e edição de manuais e tutoriais.
- **Categorização**: Organização dos guias em categorias.
- **Gestão de Conteúdo**: Funcionalidades para criar, editar e reordenar guias.

### 12. Conversa (`conversation`)
Responsável pelo gerenciamento de interações de chat, possivelmente focado em assistentes virtuais.
- **Chats**: Criação e gerenciamento de sessões de conversa.
- **Mensagens**: Envio e histórico de mensagens.
- **Ações**: Gerenciamento de intenções e ações dentro do chat.

### 13. Notificação (`notification`)
Serviço centralizado para comunicação de eventos do sistema aos usuários ou administradores.
- **Eventos de Progresso**: Notifica quando um usuário completa planetas ou o espaço (curso).
- **Alertas de Erro**: Envia notificações sobre erros críticos do sistema (servidor ou web).
