release: python manage.py migrate
web: gunicorn voice_of_kingdom.wsgi --log-file - --bind 0.0.0.0:8000