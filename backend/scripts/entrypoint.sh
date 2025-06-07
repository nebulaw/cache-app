#!/bin/bash -x


bash scripts/wait-postgres.sh
bash scripts/wait-redis.sh

# Command to set up the database and run the server
python manage.py makemigrations &&\
python manage.py migrate --noinput &&\
gunicorn config.wsgi:application\
    --bind 0.0.0.0:8000\
    --workers 3\
    --timeout 30\
    --log-level info