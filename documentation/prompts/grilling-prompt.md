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

Use obrigatoriamente:

```yaml
❓ **Q1** - **<título da pergunta>**: <pergunta e alternativas relevantes>

➡️ <resposta recomendada e justificativa concisa>

---

❓ **Q2** - **<título da pergunta>**: <pergunta e alternativas relevantes>

➡️ <resposta recomendada e justificativa concisa>
```

Cada pergunta deve trazer evidência, recomendação e impacto. Conteste contradições e riscos;
não transforme ausência de evidência em decisão implícita.

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
integrity check ou revisão, interrompa, reabra o Grilling e só continue após resolver a nova
frontier e obter a confirmação necessária.
