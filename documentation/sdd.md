# Spec-Driven Development (SDD) no StarDust

## Objetivo

O SDD transforma uma necessidade de produto em uma implementação verificável.
Todo o fluxo ocorre na mesma task/thread. O Orchestrator mantém o estado oficial
e delega implementação e avaliações independentes a Builder, Workers e Judges
como subagentes da task atual. Nenhuma fase cria uma nova thread.

```text
PRD ou demanda
→ Spec (Contract + solução técnica)
→ Judge Spec
→ Plan opcional
→ Builder (Workers opcionais)
→ sensores por package scripts
→ Judge Implementation
→ Judge Conclusion (inclui segurança proporcional ao risco)
→ PR + CI Quality Gate + build
```

## Contrato da Spec

A Spec é obrigatória antes de alterar código e possui duas partes:

- **Contract:** o que precisa ser observável e comprovado.
- **Solução técnica:** como o Contract será implementado dentro da arquitetura.

Use a nomenclatura:

- `RF-*`: requisito funcional.
- `CA-*`: critério de aceitação.
- `RN-*`: requisito arquitetural ou não funcional.

Cada `CA-*` e `RN-*` referencia um `RF-*` e declara evidência objetiva, como
teste, sensor, inspeção ou fluxo de browser. O Contract não é validado por uma
CLI própria; ele é revisado na mesma task por meio da matriz critério →
evidência.

## Quando criar um Plan

Crie um Plan quando houver múltiplas fases dependentes, mudanças entre apps,
migration relevante, risco alto, trabalho que precise ser retomado ou valor
real em registrar decisões e progresso.

Não crie Plan para uma alteração pequena, coesa e concluível na task. Nesse
caso, o Orchestrator aciona `Builder Direct`, executa os sensores e aciona
`Judge Direct`. A ausência de Plan não reduz as exigências do Contract, dos
sensores nem da avaliação independente.

## Fluxo de implementação

O Builder implementa incrementos pequenos, preferencialmente na ordem core →
infra → bordas → UI. Ele pode acionar Workers somente para unidades realmente
independentes e com paths sem sobreposição. Depois de cada incremento relevante:

1. execute `npm run format` nos arquivos ou workspaces alterados;
2. execute `npm run check:code` e `npm run check:types` no escopo afetado;
3. execute `npm run test:unit` no escopo afetado.

Ao concluir uma fase ou uma implementação direta, execute os sensores adicionais
aplicáveis:

- `npm run check:architecture` quando imports ou fronteiras mudarem;
- `npm run test:integration` quando contratos entre componentes, persistência,
  rotas ou fluxos reais mudarem;

Antes da entrega, execute todos os sensores no escopo integrado. `format` é uma
ação de escrita, não um gate. `build` não é sensor SDD: permanece como validação
final de empacotamento no CI.

## Avaliações independentes na mesma task

Depois dos sensores, o Orchestrator aciona um Judge como subagente separado do
Builder. O Judge opera read-only, recebe Contract, diff, Rules e evidências, mas
não recebe a narrativa persuasiva da implementação.

O Judge deve:

1. reler o diff completo e as Rules aplicáveis;
2. associar cada `CA-*` e `RN-*` a evidência produzida;
3. procurar regressões, lacunas de teste e desvios arquiteturais;
4. fazer revisão de segurança proporcional ao risco;
5. para autenticação, autorização, dados sensíveis, upload, execução de código,
   pagamentos ou integrações externas, exigir revisão de segurança dedicada;
6. emitir `accepted` ou `failed` com findings concretos.

O Orchestrator corrige o estado documental e devolve findings ao Builder. O
Judge nunca corrige arquivos e nunca é filho do Builder.

A implementação só pode ser concluída quando não houver critério sem evidência,
sensor obrigatório falhando ou finding bloqueante aberto.

## Quality Gate e build

Quality Gate é o nome do conjunto de checks obrigatórios do PR, não uma catraca
de baseline. Ele usa os mesmos package scripts locais. O build roda depois dos
checks e testes do app/pacote correspondente e não substitui nenhum sensor.

## Bugs

```text
relato → bug report → Spec de correção → implementação → sensores → revisão final
```

O bug report registra sintoma, impacto, evidências e diagnóstico. A Spec de
correção continua sendo o contrato da mudança.

## Fontes de verdade

Use esta precedência:

1. revisão humana explícita;
2. PRD para comportamento de produto;
3. Contract da Spec;
4. Architecture e Rules;
5. solução técnica da Spec;
6. Plan para ordem e progresso;
7. implementação atual.

Conflitos materiais devem ser resolvidos antes de continuar; não os reconcilie
por suposição.
