# 📱 Socs App

A full-stack social application developed as part of the PRJ566 project.

## 🧩 Monorepo: Frontend + Backend

This project is structured as a monorepo containing both the frontend (Next.js) and backend (Node.js + Express) applications.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

## Overview

Brief explanation of what the project does, who it’s for, and why it matters.

## Tech Stack

- **Frontend:** React / Next.js / Tailwind CSS / TypeScript / ShadcnUI
- **Backend:** Node.js / Express
- **Database:** Supabase/ PostgreSQL
- **Other:** Docker, CI/CD, Digital Ocean, Vercel, Jest

## Getting Started

### Git Usage

#### Commit Everything

Commit all changes to the repository. Make sure to include a descriptive message that summarizes the changes made.

```bash
git clone https://github.com/Solaris5959/Socs-App.git
```

#### Commit Frontend Only

If you want to commit changes only in the frontend directory, use the following command:

```bash
git add frontend/
git commit -m "feat(frontend): build homepage"
```

#### Commit Backend Only

If you want to commit changes only in the backend directory, use the following command:

```bash
git add backend/
git commit -m "fix(backend): validate login request"
```

### 🧪 Running the Project

#### Frontend (Next.js)

Run the frontend application using the following command:

```bash
cd frontend
npm run dev
```

Access: http://localhost:3000

#### Backend (Node.js + Express)

Run the backend application using the following command:

```bash
cd backend
npm run dev
```

Access: http://localhost:8080

### Environment Variables

You must configure .env files in both directories:
• frontend/.env
• backend/.env

### Branch naming convention table

This project uses a specific branch naming convention to maintain clarity and organization. Each branch type has its own prefix, which helps in identifying the purpose of the branch at a glance. The main branches are `main` and `develop`. The `main` branch is for production-ready code, while `develop` is for ongoing development.

| Branch Type | Naming Convention          | Purpose                                               |
| ----------- | -------------------------- | ----------------------------------------------------- |
| Feature     | `feat/<feature-name>`      | New features (e.g., `feat/login-ui`, `feat/api-auth`) |
| Bugfix      | `fix/<issue>`              | Minor bug fixes (e.g., `fix/navbar-scroll`)           |
| Hotfix      | `hotfix/<patch>`           | Urgent fixes for `main` (e.g., `hotfix/login-error`)  |
| Chore/Docs  | `chore/<task>`, `docs/...` | Non-functional updates (e.g., `chore/update-deps`)    |
