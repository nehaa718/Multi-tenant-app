# SaaS Notes Application (Multi-Tenant)

This is a **multi-tenant SaaS Notes Application** that allows multiple tenants (companies) to securely manage their users and notes, with role-based access and subscription limits. The app is built using the **MERN stack** (MongoDB, Express, React, Node.js) and hosted on **Vercel**.

---

## Table of Contents
1. [Features](#features)
2. [Multi-Tenancy Approach](#multi-tenancy-approach)
3. [Authentication & Authorization](#authentication--authorization)
4. [Subscription Plans](#subscription-plans)
5. [API Endpoints](#api-endpoints)
6. [Predefined Test Accounts](#predefined-test-accounts)
7. [Frontend](#frontend)
8. [Deployment](#deployment)
9. [Health Check](#health-check)
10. [Setup Instructions](#setup-instructions)

---

## Features

- Multi-tenancy support (Acme & Globex)
- JWT-based authentication
- Role-based access:
  - **Admin**: Can invite users & upgrade subscription
  - **Member**: Can create, edit, delete, and view notes
- Tenant isolation: Users only access notes from their own tenant
- Notes CRUD operations
- Free and Pro subscription plans with limits
- Frontend includes:
  - Login
  - Notes listing, create/edit/delete
  - “Upgrade to Pro” banner for free tenants
  - Invite users modal for Admins

---

## Multi-Tenancy Approach

- **Approach used:** Shared schema with a `tenantId` reference in User and Note models.
- Each tenant (company) has its own **Tenant document** in MongoDB.
- **Data isolation:** All notes and users are linked to a tenant. Users can only access data for their tenant.
- Tenant isolation is enforced both at the **API layer** and in the **frontend**.

---

## Authentication & Authorization

- **JWT-based login** using email and password.
- **Roles:**
  - **Admin:** Invite users, upgrade subscription
  - **Member:** Can create, view, edit, and delete notes
- **Middleware:** Checks role and tenant for every request to ensure proper access.

---

## Subscription Plans

| Plan | Notes Limit | Upgrade |
|------|-------------|---------|
| Free | 3 notes per tenant | Admin can upgrade via `/tenants/:slug/upgrade` |
| Pro  | Unlimited notes | Already unlimited |

- Once a tenant is upgraded to Pro, note limits are lifted immediately.

---

## API Endpoints

### Auth
- **POST** `/api/auth/login`  
  Request: `{ email, password }`  
  Response: `{ token, user: { email, role, tenant } }`

### Notes
- **POST** `/api/notes` – Create a note (tenant-isolated)
- **GET** `/api/notes` – List all notes for tenant
- **GET** `/api/notes/:id` – Retrieve specific note
- **PUT** `/api/notes/:id` – Update note
- **DELETE** `/api/notes/:id` – Delete note

### Tenants
- **POST** `/api/tenants/:slug/upgrade` – Upgrade subscription (Admin only)
- **POST** `/api/tenants/invite` – Invite a new user (Admin only)

### Health
- **GET** `/health` – Returns `{ "status": "ok" }` to verify server is running

---

## Predefined Test Accounts

All accounts use password: `password`

| Email                | Role   | Tenant  |
|---------------------|--------|---------|
| admin@acme.test     | Admin  | Acme    |
| user@acme.test      | Member | Acme    |
| admin@globex.test   | Admin  | Globex  |
| user@globex.test    | Member | Globex  |

---

## Frontend

- Minimal React frontend hosted on Vercel
- Features:
  - Login with predefined accounts
  - Create, edit, delete, and list notes
  - Admins see “Invite User” modal
  - Free tenants see “Upgrade to Pro” banner once note limit is reached
- Uses **Axios** for API calls with JWT authorization

---

## Deployment

- **Backend and frontend hosted on Vercel**
- **CORS enabled** for API
- Health endpoint available for automated testing

---

## Health Check

- `GET /health` returns:
```json
{ "status": "ok" }
