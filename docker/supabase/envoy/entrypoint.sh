#!/bin/sh
set -eu

template=/etc/envoy/listener.template.yaml
config=/tmp/envoy-listener.yaml

if [ -z "${SUPABASE_PUBLISHABLE_KEY:-}" ] || [ -z "${SUPABASE_ANON_KEY:-}" ]; then
  echo "Envoy gateway requires SUPABASE_PUBLISHABLE_KEY and SUPABASE_ANON_KEY" >&2
  exit 1
fi

sed \
  -e "s|__SUPABASE_PUBLISHABLE_KEY__|${SUPABASE_PUBLISHABLE_KEY}|g" \
  -e "s|__SUPABASE_ANON_KEY__|${SUPABASE_ANON_KEY}|g" \
  "$template" > "$config"

exec envoy "$@" -c /etc/envoy/bootstrap.yaml
