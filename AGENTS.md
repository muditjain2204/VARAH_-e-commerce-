<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Agent System Rules & Project Context

This file defines the system rules and operational constraints for AI coding agents working in this repository.

## 🤖 AI Agent Guidelines

1. **Next.js 16 Compatibility**:
   - This project uses an experimental version of Next.js 16 (`next@16.2.4`) with React 19 (`react@19.2.4`).
   - Standard APIs from Next.js 13/14/15 may have changed or been deprecated.
   - Always verify import pathways and lifecycle rules if building new pages.

2. **Styling Standards**:
   - Use CSS Modules (`*.module.css`) for all components.
   - Avoid injecting inline styles or using utility-first frameworks like Tailwind CSS, unless explicitly asked by the USER.
   - Keep styling consistent with the VARAH premium dark/light gold luxury theme system.

3. **Workspace Directories**:
   - Frontend is in the root directory.
   - Backend is in the `backend/` directory.
   - Always run commands in the correct working directory (`Cwd`) depending on whether you are working on the frontend or backend.

4. **Environment Variables**:
   - Before executing code that depends on environment variables, ensure `.env` (backend) or `.env.local` (frontend) is set up.
   - Never commit `.env` files to git. Use `.env.example` templates to record variable names.
