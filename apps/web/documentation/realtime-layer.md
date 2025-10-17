# Realtime Layer - Realtime Communication

The realtime layer is responsible for handling all realtime communication in the
web application. It uses **Supabase** to provide realtime features like live
updates and presence.

## Structure

The realtime layer is located in the `./apps/web/src/realtime` directory.

```
src/realtime/
├── supabase/
│   └── client.ts
└── types/
```

- **`supabase`**: Contains the Supabase client for realtime communication.
- **`types`**: Contains types related to the realtime layer.

## Supabase Client

The `client.ts` file exports a factory function that creates a Supabase browser
client. This client is used to subscribe to realtime channels and receive live
updates from the database.

**Example: `client.ts`**

```typescript
import { createBrowserClient } from "@supabase/ssr";

import { CLIENT_ENV } from "@/constants";

export const SupabaseClient = () => {
  return createBrowserClient(CLIENT_ENV.supabaseUrl, CLIENT_ENV.supabaseKey);
};
```

## Usage

The `SupabaseClient` is used throughout the application to interact with
Supabase's realtime features. For example, it can be used in a React hook to
subscribe to a channel and update the UI in realtime when new data is available.

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
