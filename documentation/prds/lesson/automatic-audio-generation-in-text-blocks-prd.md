---
title: Geração de Áudio Automático nos Blocos de Texto
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/31
last_updated_at: 2026-06-08
---

# PRD — Geração de Áudio Automático nos Blocos de Texto

Disponibiliza para: lesson; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

* A funcionalidade permite que a equipe do Studio gere narração em voz sintética (TTS) para os blocos de texto da história de uma estrela, bloco a bloco ou em lote para toda a história de uma vez.
* Ela resolve o problema de criar arquivos de áudio manualmente e de forma desacoplada do fluxo editorial, tornando a produção de conteúdo narrado mais rápida e centralizada.
* O objetivo principal é integrar geração de áudio diretamente no editor de blocos do Studio, com preview de escuta após processamento e geração em background, tanto individual quanto em lote, para que o operador continue navegando livremente enquanto os áudios são produzidos. A Lesson Page não é alterada nesta entrega.
* A funcionalidade também permite remover manualmente o áudio já associado a um bloco de texto no Studio, limpando a referência persistida no bloco e removendo o arquivo físico quando ele existir, sem alterar o conteúdo textual ou demais dados do bloco.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/31 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

🚧 Em construção — objetivos e métricas estruturados não estão registrados no documento legado.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O editor deve permitir acionar a geração de áudio TTS para um bloco específico a partir do seu conteúdo atual.

##### Regras de Negócio
- **Blocos elegíveis:** Apenas blocos dos tipos `default`, `alert`, `quote` e `image` expõem a ação de geração. Blocos `user` e `code` não suportam áudio.
- **Conteúdo como fonte:** O texto enviado ao provedor TTS deve ser o conteúdo atual do bloco, sem marcações MDX ou tags de formatação.
- **Geração assíncrona:** A ação dispara o processamento em background; o operador pode continuar navegando enquanto o áudio é gerado.
- **Regeneração:** Se o bloco já possuir áudio, a ação substitui o arquivo anterior sem exigir remoção manual prévia.
- **Estado por bloco:** Cada bloco deve ter seu próprio estado de geração, independente dos demais: `idle`, `pending`, `error` ou `done`.

##### Regras de Experiência
- **Localização:** O botão de geração deve estar dentro do card do bloco, visível quando o bloco estiver expandido.
- **Conteúdo mínimo:** O botão deve ficar desabilitado quando o bloco estiver com conteúdo vazio.
- **Feedback de erro:** Em caso de falha, o card deve indicar o estado de erro sem apagar o áudio anterior, se houver.

---

#### RP-02 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O editor deve oferecer uma ação para disparar a geração de áudio de todos os blocos elegíveis da história de uma vez.

##### Regras de Negócio
- **Blocos alvo:** A ação deve processar todos os blocos do tipo `default`, `alert`, `quote` e `image` presentes na lista.
- **Geração assíncrona:** O processamento ocorre em background; o operador não precisa aguardar na tela.
- **Estado individual preservado:** Cada bloco deve continuar exibindo seu próprio estado de geração durante e após o lote.
- **Regeneração inclusa:** Blocos que já possuem áudio também devem ter o áudio regenerado na ação em lote.
- **Blocos em andamento ignorados:** Blocos que já estiverem no estado `pending` no momento da ação em lote devem ser ignorados.

##### Regras de Experiência
- **Localização da ação:** O botão de geração em lote deve estar no cabeçalho do painel de blocos, separado dos controles individuais.
- **Feedback imediato:** Ao acionar o lote, todos os cards elegíveis que não estiverem em `pending` devem entrar nesse estado imediatamente.

---

#### RP-03 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O editor deve consultar periodicamente o servidor para atualizar o estado de geração dos blocos pendentes e carregar o estado atual ao abrir a página.

##### Regras de Negócio
- **Carga inicial:** Ao abrir o editor, o sistema deve buscar o estado de áudio atual de cada bloco a partir do servidor.
- **Escopo do polling:** O polling deve ocorrer apenas enquanto houver pelo menos um bloco no estado `pending`.
- **Encerramento automático:** O polling deve parar quando todos os blocos saírem do estado `pending` (concluídos ou com erro).
- **Atualização de estado:** Ao receber a resposta, o sistema deve atualizar individualmente o estado de cada bloco retornado.

##### Regras de Experiência
- **Indicador visual:** Blocos em estado `pending` devem exibir um spinner no lugar do player de áudio.
- **Sem bloqueio de edição:** O polling não deve impedir o operador de continuar editando o conteúdo dos blocos.

---

#### RP-04 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O editor deve exibir um player de áudio inline no card do bloco para que o operador escute o resultado antes de salvar.

##### Regras de Negócio
- **Disponibilidade:** O player deve aparecer apenas quando o bloco estiver no estado `done` e possuir um arquivo de áudio associado.
- **Atualização após regeneração:** Ao regenerar, o player deve refletir o novo arquivo automaticamente.

##### Regras de Experiência
- **Player compacto:** Controles de play/pause e barra de progresso, sem ocupar área excessiva do card.
- **Posicionamento:** O player deve aparecer abaixo do campo de conteúdo, dentro do card expandido.

---

#### RP-05 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Antes de acionar a geração, o operador deve poder escolher qual voz será usada na narração do bloco.

##### Regras de Negócio
- **Lista fixa:** As vozes disponíveis são pré-definidas pelo sistema, sem possibilidade de cadastro ou remoção pelo operador.
- **Configuração por bloco:** Cada bloco mantém sua própria voz selecionada, independente dos demais.
- **Voz padrão:** O sistema deve ter uma voz pré-selecionada para novos blocos, evitando que o operador precise configurar manualmente em todos os casos.
- **Voz na geração em lote:** Na geração em lote, cada bloco deve usar a voz configurada individualmente no momento da ação.
- **Persistência da voz:** O identificador da voz selecionada deve ser salvo junto ao bloco no payload de salvamento.

##### Regras de Experiência
- **Localização:** O seletor de voz deve estar dentro do card do bloco expandido, próximo ao botão de geração.
- **Feedback da seleção atual:** O seletor deve exibir o nome da voz atualmente escolhida.

---

#### RP-06 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O editor deve permitir que o operador remova manualmente o áudio associado a um bloco de texto sem apagar o conteúdo do bloco.

##### Regras de Negócio
- **Disponibilidade:** A ação de remoção deve aparecer apenas para blocos que possuam áudio associado e não estejam com `audio.status = 'pending'`.
- **Separação de fluxos:** Blocos com geração em andamento devem continuar usando o fluxo de cancelamento; remoção manual não substitui cancelamento de geração pendente.
- **Preservação de conteúdo:** A remoção deve limpar a referência `audio` do bloco sem alterar `content`, `title`, `picture`, `runnable`, tipo ou ordem dos blocos.
- **Arquivo físico:** Quando houver `audio.fileName`, o sistema deve tentar remover o arquivo correspondente em `audios/story`.
- **Idempotência:** Se o arquivo físico já não existir no storage, a operação ainda deve concluir com sucesso limpando a referência do bloco.
- **Resposta atualizada:** Após remover, o servidor deve retornar a lista atualizada de blocos para sincronizar o estado local do Studio.

##### Regras de Experiência
- **Localização:** A ação de remoção deve estar junto aos controles de áudio dentro do card expandido.
- **Feedback imediato:** Após sucesso, o card deve deixar de exibir player, badge/status de áudio e qualquer evidência visual do áudio removido.
- **Proteção contra erro:** Em caso de falha, a UI deve preservar o estado anterior do bloco e exibir feedback ao operador.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| lesson | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuário

**Gerar áudio de um bloco individualmente:**

1. O operador acessa o editor de história de uma estrela no Studio.
2. O operador expande um card de bloco elegível (`default`, `alert`, `quote` ou `image`) com conteúdo preenchido.
3. O operador seleciona a voz desejada no seletor do card.
4. O operador aciona o botão de geração de áudio dentro do card.
5. O sistema dispara a geração em background e atualiza o estado do bloco para `pending`.
6. O polling consulta o servidor periodicamente e atualiza o card para `done` com player ou `error` com feedback de falha.

---

**Gerar áudio em lote:**

1. O operador acessa o editor de história de uma estrela no Studio.
2. O operador configura a voz desejada individualmente nos blocos que quiser antes de acionar o lote.
3. O operador aciona o botão de geração em lote no cabeçalho do painel de blocos.
4. O sistema dispara a geração em background para todos os blocos elegíveis que não estejam em `pending` e atualiza o estado de cada um para `pending`.
5. O polling consulta o servidor periodicamente e atualiza cada bloco individualmente.

---

**Pré-visualizar o áudio gerado:**

1. O operador expande um card de bloco no estado `done`.
2. O player de áudio está visível abaixo do campo de conteúdo.
3. O operador aciona o play e escuta a narração gerada.
4. O operador decide se mantém o áudio, aciona regeneração ou remove o áudio do bloco.

---

**Remover áudio manualmente:**

1. O operador expande um card de bloco que possui áudio associado e não está em `pending`.
2. O operador aciona a ação de remover áudio dentro dos controles do card.
3. O sistema limpa a referência de áudio do bloco persistido e tenta excluir o arquivo físico em `audios/story` quando houver `fileName`.
4. O card é atualizado com a resposta do servidor e deixa de exibir player, status e controles dependentes do áudio removido.
5. Se o arquivo físico já não existir, a operação ainda conclui com sucesso desde que a referência do bloco seja limpa.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Reprodução de áudio na Lesson Page do aluno (app `web`). |
| Escopo | Configuração do aluno para alternar entre reprodução automática e controle manual. |
| Escopo | Geração de áudio para blocos do tipo `user` e `code`. |
| Escopo | Edição ou ajuste manual do arquivo de áudio gerado. |
| Escopo | Sincronização de áudio com markers de vídeo. |
| Escopo | Geração automática de áudio ao salvar os blocos. |
| Escopo | Gestão ou cadastro de novas vozes pelo operador. |
| Escopo | Remoção automática em massa de arquivos antigos fora do fluxo explícito de remoção manual do bloco. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
