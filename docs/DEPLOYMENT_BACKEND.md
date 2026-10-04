# Backend deployment (Render)

## Overview
The ASP.NET Core Web API (`backend/HospitalManagement.API`, .NET 10) runs as a Docker web service on Render (Free plan). It connects to a hosted Microsoft SQL Server database (MonsterASP.NET, free plan, EU). The database engine is unchanged from development: SQL Server.

- Live API base URL: https://hospital-manager-deploy.onrender.com/api
- Health check: https://hospital-manager-deploy.onrender.com/health

## Differences from the README plan
The README names Azure App Service and Azure SQL as the planned cloud platform. This assignment uses Render for the API. Azure account verification was not available, so a free hosted SQL Server was used instead. Render could not read the private team repository, so the service builds from a private deployment copy (`hospital-manager-deploy`, branch `main`), which is pushed from the team branch `devops-backend-render`.

## Code changes for production
- `Program.cs` reads the `PORT` variable that Render provides.
- JWT bearer validation uses `Jwt:Key`, `Jwt:Issuer` and `Jwt:Audience`. In production the key must be at least 32 characters or the app refuses to start.
- CORS allows only the exact origin in `FrontendUrl` (no wildcard).
- `GET /health` for Render health checks.
- HTTPS redirection runs only in development (Render handles HTTPS).
- EF Core retries transient database failures (the free database can pause when idle).
- `[Authorize]` added to `PatientsController` and `POST /api/doctors`. `GET /api/doctors` stays public.
- `Dockerfile` and `.dockerignore` in `backend/HospitalManagement.API`.

## Render settings
| Setting | Value |
|---|---|
| Service type | Web Service, Docker |
| Branch | main (of the deployment copy) |
| Root / build context | backend/HospitalManagement.API |
| Dockerfile path | backend/HospitalManagement.API/Dockerfile |
| Health check path | /health |
| Plan | Free (sleeps when idle; the first request can take up to a minute) |

## Environment variables (names only; values are set in Render and never committed)
| Name | Purpose |
|---|---|
| ASPNETCORE_ENVIRONMENT | Production |
| ConnectionStrings__DefaultConnection | Hosted SQL Server connection string |
| Jwt__Key | Token signing key, at least 32 random characters |
| Jwt__Issuer | HospitalManagement.API |
| Jwt__Audience | HospitalManagement.Frontend |
| FrontendUrl | Exact Netlify origin, no trailing slash |

`appsettings.json` holds only local placeholder values. Environment variables override it in production.

## Database migrations
Migrations are applied from a developer machine, not by the app:
1. Set `ConnectionStrings__DefaultConnection` in the terminal session (do not write it to a file).
2. Run `dotnet ef database update` from `backend/HospitalManagement.API`.
The hosted database must be updated again whenever a new migration is added.

## Verification (4 Oct 2026)
| Check | Result |
|---|---|
| GET /health | 200 |
| Login with wrong password | 401 |
| Login with correct password | Token returned |
| GET /api/patients with token | 200 |
| GET /api/patients without token | 401 |
| GET /api/patients with invalid token | 401 |
| Login after service restart | Works (data persists) |
| CORS preflight from an unlisted origin | No CORS headers returned |

## Known limitations
- The Free plan sleeps when idle; open the health URL before a demo.
- The free database host is shared; use test data only.
- The `Microsoft.OpenApi` 2.0.0 package has a known vulnerability warning; the sample