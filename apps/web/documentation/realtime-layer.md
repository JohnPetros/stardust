# Camada Realtime - Comunicação em Tempo Real

A camada de tempo real é responsável por lidar com toda a comunicação em tempo real na aplicação web. Ela usa o **Supabase** para fornecer recursos em tempo real, como atualizações ao vivo e presença.

## Estrutura

A camada de tempo real está localizada no diretório `./apps/web/src/realtime`.

```
src/realtime/
├── supabase/
│   └── client.ts
└── types/
```

- **`supabase`**: Contém o cliente Supabase para comunicação em tempo real.
- **`types`**: Contém tipos relacionados à camada de tempo real.

## Cliente Supabase

O arquivo `client.ts` exporta uma factory function que cria um cliente Supabase para o navegador. Este cliente é usado para se inscrever em canais em tempo real e receber atualizações ao vivo do banco de dados.

**Exemplo: `client.ts`**

```typescript
import { createBrowserClient } from "@supabase/ssr";

import { CLIENT_ENV } from "@/constants";

export const SupabaseClient = () => {
  return createBrowserClient(CLIENT_ENV.supabaseUrl, CLIENT_ENV.supabaseKey);
};
```

## Uso

O `SupabaseClient` é usado em toda a aplicação para interagir com os recursos em tempo real do Supabase. Por exemplo, ele pode ser usado em um hook React para se inscrever em um canal e atualizar a UI em tempo real quando novos dados estiverem disponíveis.

```typescript
import { useEffect, useState } from "react";
import { SupabaseClient } from "@/realtime/supabase";

const useRealtimeMessages = (channelName: string) => {
  const [messages, setMessages] = useState([]);
  const supabase = SupabaseClient();

  useEffect(() => {
    const channel = supabase.channel(channelName);

    channel
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, supabase]);

  return messages;
};
```