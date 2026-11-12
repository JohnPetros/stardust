---
name: grilling
description: Conduzir o gate de decisões antes de escrever ou mutar um artefato SDD.
---

# Grilling gate

Depois da pesquisa factual e antes de escrever ou criar o artefato, aplique este protocolo.
Ele é obrigatório para tickets, PRDs, Specs e Plans; adapte as perguntas ao tipo de artefato
sem remover decisões materiais.

## Design tree e frontier

1. Pesquise primeiro os fatos no repositório, nas autoridades, no design, no GitHub/Jira e nas
   demais fontes aplicáveis. Use pesquisa read-only delimitada quando houver uma fronteira
   independente. Nunca peça ao usuário fatos que possam ser verificados.
2. Modele as decisões ainda abertas como uma **design tree**. Cada decisão deve declarar as
   decisões que dependem dela, as alternativas relevantes, o impacto e a evidência disponível.
3. Calcule a **frontier** do round: todas as decisões materialmente necessárias cujos pré-requisitos
   já estejam resolvidos. Não adivinhe uma decisão pendente para liberar uma pergunta descendente.
4. Pergunte toda a frontier atual em um único round numerado. Depois de cada resposta, registre a
   decisão, alternativas descartadas, dependências e contradições; recompute a árvore e a próxima
   frontier. Perguntas que dependem de respostas do round atual ficam para o round seguinte.

## Formato das perguntas

Escreva o round diretamente em Markdown na conversa (não dentro de bloco de código), usando
obrigatoriamente esta estrutura:

```md
## Grilling — round <n> (<k> perguntas)

❓ **Q<n> — <decisão em poucas palavras>**
<Contexto: o fato verificado que abre a decisão, com evidência (`path:linha`, issue, doc), em até
três linhas. Depende de: <Qx = resposta> ou "nenhuma".>

- **(a) <opção>** — <consequência ou trade-off desta opção>
- **(b) <opção>** — <consequência ou trade-off desta opção>

➡️ **Recomendo (a)** — <justificativa em uma frase>.

---

❓ **Q<n+1> — ...**

---

**Adiadas:** Q<m> — <decisão> (depende de Q<n>).
**Como responder:** `Q<n>: a` por linha; texto livre também vale. Pergunta sem resposta continua aberta.
```

Regras do formato:

- **Uma decisão por pergunta.** Se a escolha de uma opção abre outra decisão (por exemplo,
  renomear e também mudar o contrato), separe em duas perguntas e adie a dependente.
- **Contexto autossuficiente.** O usuário deve entender a pergunta sem rolar a conversa: diga o
  que existe hoje, o que muda e por que a decisão está aberta. Não pressuponha termos não definidos
  no round ou em rounds anteriores.
- **Opções explícitas.** De duas a quatro opções mutuamente exclusivas, rotuladas `(a)`, `(b)`…,
  cada uma com sua consequência. Não esconda opções dentro de um parágrafo. Não invente opção
  só para completar a lista; quando houver só um caminho viável, pergunte confirmação.
- **Recomendação referenciada.** A linha `➡️` cita a letra recomendada e o motivo principal;
  impacto e evidência já estão no contexto e nas opções.
- **IDs estáveis.** Numere as perguntas em sequência por toda a sessão (`Q1`, `Q2`…), sem reiniciar
  por round. Uma decisão reaberta recebe novo ID com `Reabre Qx` no contexto; um desdobramento de
  uma resposta pode usar sufixo (`Q9a`).
- **Respostas ambíguas.** Não infira. Se a resposta não identifica a pergunta ou a opção, ou só
  responde parte do round, confirme em uma linha a interpretação e repita, em forma curta, apenas
  as perguntas ainda abertas.
- **Registro do round.** Depois das respostas, liste as decisões tomadas (`Qx → opção`) antes de
  abrir o próximo round ou a revisão de design.

Conteste contradições e riscos; não transforme ausência de evidência em decisão implícita.

## Frontier mínima para tickets

Em tickets, faça perguntas sobre cada item abaixo que permanecer materialmente unresolved:

- ator e outcome;
- escopo e exclusões;
- permissões;
- aceitação e comportamento de falha;
- fronteira técnica;
- expectativas de validação;
- se um ticket é a decomposição correta;
- sprint;
- assignee.

Para PRDs, Specs e Plans, percorra as mesmas decisões quando forem aplicáveis e acrescente as
decisões próprias do artefato. O Grilling não substitui pesquisa factual, aprovação de issue,
aprovação de publicação ou decisão de mudança de autoridade.

## Gate de escrita e confirmação

Não escreva o ticket ou qualquer artefato, nem mute Jira/GitHub ou outra autoridade externa,
enquanto existir um ramo material unresolved. Quando a frontier estiver vazia, apresente o
entendimento compartilhado e obtenha confirmação explícita do usuário antes de criar, atualizar
ou publicar o artefato.

Registre as decisões resolvidas, alternativas descartadas e premissas aceitas no artefato final;
não copie o transcript da entrevista. Se uma nova decisão material surgir durante a escrita,
checagem de integridade ou revisão, interrompa, reabra o Grilling e só continue após resolver a nova
frontier e obter a confirmação necessária.
