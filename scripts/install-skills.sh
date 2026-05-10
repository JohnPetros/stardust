#!/bin/bash

set -euo pipefail

skills=(
  "vercel-labs/skills@find-skills"
  "anthropics/skills@frontend-design"
  "github/awesome-copilot@gh-cli"
  "cloudflare/vinext@migrate-to-vinext"
  "chiroro-jr/pencil-design-skill@pencil-design"
  "addyosmani/web-quality-skills@performance"
  "google-labs-code/stitch-skills@shadcn-ui"
  "vercel-labs/agent-skills@vercel-react-best-practices"
  "pproenca/dot-skills@zod"
)

for skill in "${skills[@]}"; do
  npx skills add "$skill"
done
