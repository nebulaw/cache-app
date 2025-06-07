#!/bin/bash -x

# A script to wait for Redis until it's ready
cmd="$@"

while ! (echo > /dev/tcp/$REDIS_HOST/$REDIS_PORT) 2>/dev/null; do
  sleep 1
done

>&2 echo "Redis is up - executing command"
exec $cmd