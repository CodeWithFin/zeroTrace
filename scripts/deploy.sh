#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/zeroTrace}"
BRANCH="${DEPLOY_BRANCH:-finley}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

cd "$APP_DIR"

echo "==> Fetching $BRANCH"
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> Building and restarting containers"
docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans

echo "==> Pruning unused images (safe)"
docker image prune -f >/dev/null 2>&1 || true

echo "==> Health check"
sleep 2
curl -fsS "http://127.0.0.1:3020" >/dev/null && echo "ZeroTrace is up on :3020" || {
  echo "Warning: health check failed — check logs with: docker compose -f $COMPOSE_FILE logs --tail=50"
  exit 1
}
