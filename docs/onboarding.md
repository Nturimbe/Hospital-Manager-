# New Engineer Onboarding

This guide takes a new engineer from a clean machine to a running local copy of the
Hospital Management System. Follow the steps in order. If a step fails, see
"Troubleshooting" at the bottom.

## 1. Prerequisites

Install these before starting. Versions come from the Phase 1 plan, Section 4.8.

| Tool | Required version | Check with |
|---|---|---|
| Git | 2.4x or later | `git --version` |
| Docker Desktop | Latest stable (includes Compose v2) | `docker --version` and `docker compose version` |
| Node.js | 22.x LTS | `node --version` |
| .NET SDK | 10.0 LTS | `dotnet --version` |
| IDE | VS Code or Visual Studio 2022 | n/a |

Docker Desktop must be running before you use any `docker` command.
Only the SQL Server, API and web containers need Docker. Node and .NET are needed
for editor tooling and for running EF Core migrations from your machine.

## 2. Clone the repository

```bash
git clone https://github.com/Nturimbe/Hospital-Manager-.git
cd Hospital-Manager-
git checkout develop
```

## 3. Create your local environment file

```bash
cp .env.example .env
```

Open `.env` and replace both placeholder values:

- `SQL_SA_PASSWORD`: at least 8 characters, using at least 3 of: uppercase,
  lowercase, digit, symbol. SQL Server rejects weaker passwords.
- `JWT_SIGNING_KEY`: a random string of at least 32 characters.

Any strong values are fine locally. They never leave your machine.
`.env` is ignored by Git. Never commit it, and never paste its values into chats,
issues or pull requests.

## 4. Start the stack

```bash
docker compose up --build
```

Expected: Docker builds the API and web images, starts `hms-local-sql`, waits until it
reports `healthy`, then starts `hms-local-api` and `hms-local-web`.

## 5. Apply the database schema

In a second terminal, from the repository root:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update \
  --project src/server/HMS.Infrastructure \
  --startup-project src/server/HMS.Api \
  --connection "Server=localhost,1433;Database=HmsDb;User Id=sa;Password=<your SQL_SA_PASSWORD>;TrustServerCertificate=True;"
```

Replace `<your SQL_SA_PASSWORD>` with the value from your `.env`.
Skip the install line if `dotnet ef --version` already works.

## 6. Check that it works

| What | Where | Expected |
|---|---|---|
| Web app | http://localhost:3000 | The login screen loads |
| API | http://localhost:5000 | The API responds |
| Database | `docker ps` | `hms-local-sql` shows `(healthy)` |

## 7. Stop the stack

- Stop everything and keep your data: `docker compose down`
- Stop everything and delete the local database: `docker compose down -v`

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `docker: command not found` | Docker Desktop not installed or not running | Install and start Docker Desktop, then reopen your terminal |
| `hms-local-sql` exits at once | Weak `SQL_SA_PASSWORD` | Use a stronger password, then `docker compose down -v` and start again |
| API never starts | SQL Server not healthy yet | Wait, or run `docker compose logs sql-server` |
| `npm install` fails on engine error | Wrong Node version | Run `nvm use` inside `src/client` (Node 22) |
| Port 1433, 3000 or 5000 already in use | Another program uses it | Stop that program or change the left-hand port number in `docker-compose.yml` |

## Notes

- Use only fabricated data locally. Never load real patient data into any environment
  except production.
- Do not commit anything listed in `.gitignore`.