# Hospital Management System

Hospital Management System (HMS) is a web-based hospital management application being developed as an academic software project.

The project uses a React + TypeScript frontend, an ASP.NET Core Web API backend, SQL Server for relational data storage, Entity Framework Core for data access, and ASP.NET Identity + JWT for authentication.

The repository is structured as a monorepo so that the frontend, backend, infrastructure configuration, documentation, and DevOps configuration can be managed together.


## Technology Stack

### Frontend

- React
- TypeScript
- Node.js 22 LTS
- npm

### Backend

- ASP.NET Core Web API
- .NET 10 LTS
- C#
- Entity Framework Core
- ASP.NET Identity
- JWT authentication

### Database

- Microsoft SQL Server
- SQL Server 2022 for local containerized development
- Azure SQL Database for cloud environments

### DevOps and Cloud

- Git
- GitHub
- GitHub Actions
- Docker
- Docker Compose
- Microsoft Azure
- Azure App Service
- Azure SQL Database
- Azure Container Registry

Terraform and Azure Key Vault are part of the planned platform architecture but are introduced in later delivery phases rather than implemented as part of this initial repository foundation.


## Environments

The project defines three environments:

| Environment | Purpose | Data |
|---|---|---|
| Local | Individual developer workstation | Fabricated/synthetic data |
| Staging | Shared QA and integration environment | Synthetic realistic data |
| Production | Live application environment | Real patient data |

Staging is intended to use the same fundamental operating-system base, application images, database engine/version, and configuration mechanisms as production. Differences should primarily concern scale and data.

Real patient data must not be used in local or staging environments.

Production changes must pass through staging before reaching production.


## Repository Structure

```text
hospital-management-system/
├── .github/
│   └── workflows/
│
├── docs/
│   ├── architecture/
│   ├── runbooks/
│   └── onboarding.md
│
├── infra/
│   ├── docker/
│   └── terraform/
│
├── src/
│   ├── client/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── .nvmrc
│   │   ├── .npmrc
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   └── server/
│       ├── HMS.Api/
│       ├── HMS.Application/
│       ├── HMS.Domain/
│       ├── HMS.Infrastructure/
│       ├── HMS.Tests/
│       ├── Dockerfile
│       └── appsettings.example.json
│
├── docker-compose.yml
├── .editorconfig
├── .gitignore
└── README.md

## Production Links
Frontend: https://hms-ug-hospital-portal.netlify.app
Backend API: https://hospital-manager-deploy.onrender.com