# CLAUDE.md — Developer Guidelines & Commands

Welcome to the development guidelines for the **VARAH Multi-Vendor Marketplace**. This guide is designed to help AI agents and human developers quickly build, run, and understand the project architecture.

---

## 🚀 Build & Development Commands

This project is structured with a Next.js frontend in the root directory and a Node.js/Express/Prisma backend in the `/backend` directory.

### Frontend (Next.js) — Root Directory
- **Start Local Dev Server:** `npm run dev`
- **Production Build:** `npm run build`
- **Start Production Server:** `npm run start`
- **Lint Code:** `npm run lint`

### Backend (Express & Prisma) — `/backend` Directory
- **Start Local Dev Server (with Nodemon):** `npm run dev` (inside `/backend`)
- **Start Production Server:** `npm run start` (inside `/backend`)
- **Push Schema to Database (Prisma):** `npm run db:push` (syncs schema to DB without migrations)
- **Generate Migrations & Update Client:** `npm run db:migrate`
- **Seed Database with Sample Data:** `npm run db:seed`
- **Open Prisma Studio (DB GUI):** `npm run db:studio`

---

## 🎨 Technology Stack & Architecture

### Frontend
- **Framework:** Next.js (Version 16.x) with App Router.
- **Styling:** CSS Modules (`*.module.css`) for high isolation and component styling. Avoid global utility frameworks unless explicitly configured.
- **Icons:** `lucide-react` for iconography.
- **State Management:** React Context API (located in `src/context/` for Cart, Wishlist, Theme, etc.).

### Backend
- **Framework:** Express.js (Version 5.x).
- **ORM:** Prisma Client interacting with PostgreSQL (Neon DB).
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` for secure password hashing.
- **Image Hosting:** Cloudinary via Multer middleware.
- **Payments:** Razorpay for secure marketplace payments.

---

## 🛠️ Code Guidelines & Standards

1. **Component Modularization**: Keep components focused, isolated, and highly reusable. Styling should be handled primarily through companion CSS Modules.
2. **Environment Variables**:
   - Never commit actual `.env` credentials to git.
   - Reference the root `.env.example` and backend `.env.example` templates for configuration requirements.
3. **Database Schema changes**:
   - Update `backend/prisma/schema.prisma` first.
   - Run `npm run db:push` or `npm run db:migrate` in the backend folder to apply updates and regenerate Prisma Client models.
4. **Refer to Agent Rules**:
   - Always read `AGENTS.md` before initiating any Next.js operations, as Next.js 16 includes breaking changes and deprecations.
