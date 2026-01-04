# Widget de listagem infinita

## Objetivo

Criar um widget de listagem infinita que faça fetching de mais dados a medida
que o usuário rola a tela.

status: Concluído

## Camada UI

- Crie o widget como um component global com o nome `InfiniteList`.
- Deve conter um prop chamada `onShowMore` que é chamado quando o usuário atinge
  o fim da lista
- Deve conter `children` que é o conteúdo do widget
- Use o código abaixo como base para o hook do widget:

```ts
const sentinelRef = useRef<HTMLDivElement>(null);
const isInView = useInView(sentinelRef);

useEffect(() => {
  if (isInView && !isReachedEnd && !isLoading) {
    onShowMore();
  }
}, [isInView, isReachedEnd, isLoading, onShowMore]);
```
