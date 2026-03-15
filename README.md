# Voice of Kingdom (VOKIM)

A full-stack web application for the Voice of Kingdom gospel music artist/band. Built with **React 18** (frontend) and **Django 4.2** (backend), deployed on **Heroku** at [vokim.ca](https://vokim.ca).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Create React App, Tailwind CSS, Bootstrap 5, Material-UI |
| Backend | Django 4.2, Django REST Framework |
| Database | PostgreSQL (AWS RDS — used in both production and local dev) |
| Media Storage | Cloudinary |
| Static Files | WhiteNoise |
| Deployment | Heroku (Linux) + Gunicorn |

---

## Windows (Local) vs Heroku (Linux) — Key Differences

This project is developed on **Windows** but deployed to **Heroku which runs Linux**. Be aware of these differences:

| Concern | Windows (Local) | Heroku Linux |
|---------|----------------|--------------|
| Virtual env activation | `venv\Scripts\activate` | `source venv/bin/activate` |
| Production detection | `os.getcwd()` is a Windows path | `os.getcwd() == '/app'` triggers SSL/debug settings |
| Line endings | CRLF by default | LF required |
| Path separators | `\` | `/` |
| Shell | Use Git Bash, not CMD/PowerShell | Bash |

> **Always use Git Bash** (not Command Prompt or PowerShell) when running commands for this project on Windows. All commands in this README assume Git Bash.

### Line Ending Warning

The `Procfile` and any shell scripts **must use LF line endings**, not Windows CRLF. If you edit these files on Windows, your editor may silently convert them to CRLF, which will break Heroku deployment.

In VS Code, set `"files.eol": "\n"` in workspace settings, or check/fix before committing:

```bash
# Check if Procfile has CRLF
file Procfile

# Convert to LF if needed (Git Bash)
sed -i 's/\r//' Procfile
```

---

## Prerequisites

| Tool | Required Version | Check |
|------|-----------------|-------|
| Python | 3.9.x | `python --version` |
| Node.js | 16+ (18 recommended) | `node --version` |
| npm | 8+ | `npm --version` |
| Git + Git Bash | Any | `git --version` |

> **Python version:** The production runtime is Python 3.9.0 (`runtime.txt`). Use 3.9.x locally to avoid dependency mismatches between Windows and Heroku Linux.

---

## Database — Important

> **There is no local SQLite option.** The `settings.py` is hardcoded to connect to the **production AWS RDS PostgreSQL** database at all times, both locally and on Heroku.

This means:
- You need network access to the AWS RDS instance to run the project locally
- Any migrations or data changes you run locally **affect the production database**
- Be careful when running `python manage.py migrate` or shell commands locally

If you want a safe local-only database for development, `settings.py` would need to be updated — ask before changing this.

---

## Project Structure

```
voice-of-kingdom-all/
├── manage.py                   # Django entry point
├── requirements.txt            # Python dependencies
├── Procfile                    # Heroku deployment config (must have LF line endings)
├── runtime.txt                 # Python version (3.9.0)
├── .env                        # Local env vars — NOT committed to git
├── voice_of_kingdom/           # Django project settings & URLs
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apis/                       # Django REST API app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── migrations/
├── music-artist-website/       # React frontend (Create React App)
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── Routes.js
│   │   ├── components/
│   │   └── styles/
│   └── build/                  # Compiled frontend — committed to git for Heroku
├── staticfiles/                # Collected Django static files
└── media/                      # Uploaded media files
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd voice-of-kingdom-all
git checkout develop
```

### 2. Set Up the Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Git Bash on Windows)
source venv/Scripts/activate

# Install dependencies
pip install -r requirements.txt
```

> **Git Bash on Windows:** Use `source venv/Scripts/activate` (forward slash, capital `S` in `Scripts`).
> On Mac/Linux it is `source venv/bin/activate`.

### 3. Environment Variables (optional)

Create a `.env` file in the project root (same folder as `manage.py`):

```bash
touch .env
```

The `.env` file is loaded by `python-dotenv` in `settings.py`. Credentials are currently hardcoded in `settings.py` so no `.env` entries are required for local dev. This file is available if you need to override settings.

```env
# Optional local overrides — currently nothing required here
# DATABASE_URL=  # Not needed — settings.py uses hardcoded AWS RDS connection
```

### 4. Run Database Migrations

```bash
python manage.py migrate
```

> **Reminder:** This runs against the **production** AWS RDS database. Only run this when you have new migration files to apply.

### 5. Create a Superuser (optional)

```bash
python manage.py createsuperuser
```

Access Django Admin at: `http://127.0.0.1:8000/admin`

### 6. Start the Django Backend Server

```bash
python manage.py runserver
```

Django runs at: `http://127.0.0.1:8000`

### 7. Set Up the React Frontend

Open a **second Git Bash terminal** (keep Django running in the first).

```bash
cd music-artist-website
npm install
npm start
```

React dev server runs at: `http://localhost:3000`

> API requests from React proxy to Django at `http://127.0.0.1:8000`. Both servers must be running simultaneously during development.

---

## Frontend Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About Us |
| `/contact` | Contact |
| `/publication` | Publications |
| `/music` | Music |
| `/join` | Join VOKIM |
| `/gallery` | Gallery |
| `/donate` | Donate |
| `/band-book` | Band Booking |
| `/message` | Message |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subscribe/` | Email newsletter subscription |
| POST | `/api/contact/` | Contact form submission |
| POST | `/api/bookings/` | Band booking request |
| POST | `/api/join-musician/` | Musician membership application |
| POST | `/api/join-non-musician/` | Non-musician membership application |
| POST | `/api/upload-document/` | Document upload |
| GET | `/api/gallery-images/` | Fetch gallery images |
| GET | `/csrf/` | Get CSRF token |

---

## Building for Production (Before Deployment)

Django serves the **compiled React build**, not the dev server. Always rebuild after frontend changes:

```bash
# Step 1: Build React (from music-artist-website/)
cd music-artist-website
npm run build

# Step 2: Collect static files (from project root)
cd ..
python manage.py collectstatic --noinput
```

The compiled `music-artist-website/build/` folder **must be committed to git** — Heroku reads it directly from the repo to serve the frontend. It is intentionally not in `.gitignore`.

---

## Deployment Workflow

Heroku (Linux) automatically:
- Detects Python via `runtime.txt` and `requirements.txt`
- Runs `python manage.py migrate` on each release (from `Procfile`)
- Serves via `gunicorn voice_of_kingdom.wsgi`
- Activates production mode (`DEBUG=False`, `SECURE_SSL_REDIRECT=True`) when `os.getcwd() == '/app'`

```bash
# 1. Pull latest
git pull origin develop

# 2. Make your changes

# 3. Build the React frontend
cd music-artist-website && npm run build && cd ..

# 4. Collect static files
python manage.py collectstatic --noinput

# 5. Commit everything (including build folder)
git add .
git commit -m "your commit message"
git push origin develop
```

---

## Common Debugging Steps

### Virtual environment not activating (Windows / Git Bash)

```bash
source venv/Scripts/activate

# Verify it's active:
which python
# Expected: /c/Users/.../venv/Scripts/python
```

### Django server won't start

- Confirm venv is activated
- Run `python manage.py check` for configuration errors
- If `psycopg2` install fails on Windows: `pip install psycopg2-binary`
- Ensure all deps installed: `pip install -r requirements.txt`

### Can't connect to database

- The project uses AWS RDS — confirm you have internet access
- Your IP may need to be whitelisted in the AWS RDS security group (ask project owner)

### React app shows blank page or API errors

- Confirm Django is running on port 8000
- Open browser DevTools → Network tab to check failed requests
- Make sure `npm install` was run inside `music-artist-website/`

### Database migration errors

```bash
python manage.py showmigrations   # Check state
python manage.py migrate          # Apply pending
```

### Static files not loading (production-mode test)

```bash
cd music-artist-website && npm run build && cd ..
python manage.py collectstatic --noinput
```

### Heroku deployment fails

- Check logs: `heroku logs --tail`
- Verify `Procfile` has LF line endings (not CRLF)
- Confirm `music-artist-website/build/` is committed
- Confirm `runtime.txt` says `python-3.9.0`

### Verbose Django output

```bash
python manage.py runserver --verbosity 2
```

---

## Important Notes

- **Never commit `.env`** — it is in `.gitignore`
- **The database is shared** — local dev hits the same AWS RDS PostgreSQL as production; be careful with data changes
- **Commit the React build** — `music-artist-website/build/` must be in git for Heroku to serve the frontend
- **Always use Git Bash on Windows** — CMD and PowerShell will cause path and command issues
- **Watch line endings** — `Procfile` and shell scripts must be LF, not CRLF
- **Do not modify** theme, colours, fonts, or layout — the design is finalized by the site owner
- **Working branch:** `develop` | **Production branch:** `main`
