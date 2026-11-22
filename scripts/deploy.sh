#!/usr/bin/env bash
# Despliega el sitio al servidor Lightsail.
#
#   npm run deploy
#
# Compila en esta máquina (el servidor tiene 1 GB de RAM y `next build` no cabe)
# y sube solo el resultado. El servidor queda en el mismo commit que se compiló.
# Requiere: cambios commiteados y la llave .pem en la raíz del proyecto.
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
HOST=${DEPLOY_HOST:-ubuntu@16.59.173.224}
KEY=${DEPLOY_KEY:-$ROOT/ORBIT-LightsailDefaultKey-us-east-2.pem}
SITE_URL=${SITE_URL:-https://16.59.173.224}
APP=/home/ubuntu/cocinasyproyectosaa
SSH=(ssh -i "$KEY" -o ConnectTimeout=20)

cd "$ROOT"
if [ -n "$(git status --porcelain)" ]; then
  echo "Hay cambios sin commit. Haz commit antes de desplegar." >&2
  exit 1
fi
git push --quiet
COMMIT=$(git rev-parse HEAD)
echo "Desplegando $(git log --oneline -1)"

# Copia limpia del commit, compilada con las variables de producción.
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
git archive "$COMMIT" | tar -x -C "$TMP"
cat > "$TMP/.env.production" <<EOF
NEXT_PUBLIC_SANITY_PROJECT_ID=fm9l6ri0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=$SITE_URL
EOF
(cd "$TMP" && npm ci --no-audit --no-fund --loglevel=error && NEXT_TELEMETRY_DISABLED=1 npm run build)
rm -rf "$TMP/.next/cache"

# Servidor: mismo commit y dependencias (solo si cambió el lockfile).
"${SSH[@]}" "$HOST" "set -e; cd $APP
  OLD=\$(sha1sum package-lock.json | cut -d' ' -f1)
  git fetch --quiet origin && git reset --quiet --hard $COMMIT
  [ \"\$OLD\" = \"\$(sha1sum package-lock.json | cut -d' ' -f1)\" ] && [ -d node_modules ] || npm ci --no-audit --no-fund --loglevel=error"

# Sube el build a una carpeta aparte y lo activa de golpe.
rsync -az --delete -e "${SSH[*]}" "$TMP/.next/" "$HOST:$APP/.next-new/"
"${SSH[@]}" "$HOST" "set -e; cd $APP
  sed -i 's#^NEXT_PUBLIC_SITE_URL=.*#NEXT_PUBLIC_SITE_URL=$SITE_URL#' .env.production
  rm -rf .next-old; [ -d .next ] && mv .next .next-old; mv .next-new .next
  sudo systemctl restart cocinas; rm -rf .next-old
  sleep 3; curl -s -o /dev/null -w 'Servidor: HTTP %{http_code}\n' http://127.0.0.1:3000/"
