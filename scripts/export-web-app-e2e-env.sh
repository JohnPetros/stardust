#!/bin/sh

# Carrega as variáveis privadas da inspeção visual da Web App.
# Use: source ./scripts/export-web-app-e2e-env.sh

web_app_e2e_env_error() {
  printf '%s\n' "Erro: $1" >&2
  return 1
}

web_app_e2e_env_read() {
  web_app_e2e_key="$1"
  web_app_e2e_value="$(awk -v key="$web_app_e2e_key" '
    /^[[:space:]]*#/ || /^[[:space:]]*$/ { next }
    {
      line = $0
      sub(/^[[:space:]]*/, "", line)
      split(line, fields, "=")
      name = fields[1]
      sub(/[[:space:]]*$/, "", name)
      if (name == key) {
        sub(/^[^=]*=[[:space:]]*/, "", line)
        print line
        exit
      }
    }
  ' "$WEB_APP_E2E_ENV_FILE")"

  if [ -z "$web_app_e2e_value" ]; then
    web_app_e2e_env_error "$web_app_e2e_key não encontrado em $WEB_APP_E2E_ENV_FILE"
    return 1
  fi

  web_app_e2e_value="$(printf '%s' "$web_app_e2e_value" | sed \
    -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
  printf '%s' "$web_app_e2e_value"
}

web_app_e2e_env_main() {
  WEB_APP_E2E_ENV_FILE="$(git rev-parse --show-toplevel 2>/dev/null)/.env.development"

  [ -f "$WEB_APP_E2E_ENV_FILE" ] ||
    web_app_e2e_env_error "arquivo $WEB_APP_E2E_ENV_FILE não encontrado"

  WEB_APP_E2E_EMAIL="$(web_app_e2e_env_read WEB_APP_E2E_EMAIL)" || return 1
  WEB_APP_E2E_PASSWORD="$(web_app_e2e_env_read WEB_APP_E2E_PASSWORD)" || return 1
  export WEB_APP_E2E_EMAIL
  export WEB_APP_E2E_PASSWORD

  printf '%s\n' 'Variáveis WEB_APP_E2E_* exportadas.' >&2
}

if web_app_e2e_env_main; then
  :
else
  web_app_e2e_env_status=$?
  return "$web_app_e2e_env_status" 2>/dev/null || exit "$web_app_e2e_env_status"
fi
