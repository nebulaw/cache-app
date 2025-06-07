#!/bin/bash -x

# A script to wait for postgres until it's ready

set -e

cmd="$@"

echo "Waiting for PostgreSQL at $POSTGRES_HOST:$POSTGRES_PORT"

while ! (echo > /dev/tcp/$POSTGRES_HOST/$POSTGRES_PORT) 2>/dev/null; do
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd