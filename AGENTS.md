<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md


# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.




## 1. Project Overview

This project is a modern, production-ready SaaS application.

Technology stack:
- Next.js with App Router
- TypeScript
- Bun
- Tailwind CSS
- shadcn/ui
- Node.js backend or Next.js Route Handlers, based on the approved project architecture
- Light and Dark theme
- Plus Jakarta Sans font

## 2. Main Rule

Before creating or changing code:
1. Read this file.
2. Check the existing project structure.
3. Reuse existing components, styles, utilities, and patterns.
4. Do not introduce a new pattern when an existing pattern can be reused.
5. Ask for clarification if a requirement conflicts with these rules.

Do not make random design or architecture decisions.

## 3. UI and Design System

### Design Style
- Use a clean, modern SaaS design.
- Keep the interface simple, professional, accessible, and responsive.
- Prefer consistent spacing, alignment, and visual hierarchy.
- Avoid unnecessary animations, gradients, shadows, and decorative elements.
- Use a clear empty state, loading state, error state, and success state where appropriate.

### Typography
- Use Plus Jakarta Sans throughout the application.
- Do not introduce another font unless explicitly approved.
- Use a consistent type scale for headings, body text, labels, and helper text.

### Colors
- Use semantic theme tokens instead of hardcoded colors.
- Support both Light and Dark themes.
- Do not use random color values in individual components.
- Add new colors to the central theme only when necessary and explain why.
- Maintain sufficient contrast for accessibility.

### Components
- Prefer shadcn/ui components where suitable.
- Reuse shared components before creating new ones.
- Keep buttons, inputs, cards, dialogs, tables, alerts, and navigation visually consistent.
- Do not duplicate component code unnecessarily.
- Any new reusable component should be placed in the shared components area.

### Responsive Design
- Design for mobile, tablet, and desktop.
- Avoid fixed widths that break smaller screens.
- Check keyboard navigation and visible focus states.
- Do not hide important functionality only on mobile without an approved reason.

## 4. Coding Rules

- Use TypeScript strictly.
- Avoid `any` unless there is a documented reason.
- Use clear and descriptive names.
- Keep functions and components small and focused.
- Prefer server components in Next.js when client-side interactivity is not needed.
- Use client components only when required.
- Keep business logic separate from UI whenever practical.
- Validate user input.
- Handle loading, errors, and empty states.
- Never expose secrets, API keys, or private credentials in client-side code.
- Use environment variables for secrets and configuration.
- Do not remove working functionality without approval.

## 5. File and Folder Rules

- Follow the existing folder structure.
- Do not create duplicate folders for the same purpose.
- Keep shared UI components in the established components directory.
- Keep reusable utilities in the established lib/utils directory.
- Keep API and backend logic in the approved backend/API location.
- Use consistent file naming and import conventions.
- Before creating a file, check whether a suitable file already exists.

## 6. Data and Backend Rules

- Keep API responses predictable and consistent.
- Validate request data on the server.
- Handle authentication and authorization carefully.
- Never trust client-side validation alone.
- Return useful error messages without exposing sensitive internal details.
- Use proper HTTP status codes.
- Do not place database queries directly inside presentational UI components when a service or server layer is available.

## 7. Accessibility Rules

- Use semantic HTML.
- All form fields must have accessible labels.
- Buttons must clearly describe their action.
- Images must have meaningful alt text when needed.
- Ensure keyboard accessibility.
- Do not rely only on color to communicate meaning.
- Maintain readable contrast in both themes.

## 8. AI Assistant Workflow

Before coding:
1. Explain what you plan to change in simple language.
2. List the files you expect to create or modify.
3. Check existing patterns and components.
4. Mention any assumptions.

While coding:
1. Make the smallest safe change.
2. Reuse existing code.
3. Follow this file and the existing design system.
4. Do not change unrelated files.
5. Do not install new packages without explaining the reason.

After coding:
1. Summarize the changes.
2. Show commands to run or test.
3. Mention any remaining issues.
4. Check formatting, linting, type errors, and relevant tests when available.

## 9. ChatGPT and Claude Collaboration

### ChatGPT responsibilities
- Help with product planning, architecture, feature breakdown, UX decisions, and review.
- Produce clear implementation instructions.
- Review Claude-generated code for consistency, security, and maintainability.
- Do not suggest changes that conflict with this file without explaining the reason.

### Claude responsibilities
- Implement approved instructions.
- Read and follow this file before making changes.
- Inspect existing code before creating new code.
- Keep the UI consistent with the established design system.
- Report changed files and validation results.

### Conflict Rule
If a user request conflicts with this file:
1. Clearly explain the conflict.
2. Ask whether the rule should be updated.
3. Do not silently ignore the rule.

## 10. Definition of Done

A feature is considered complete only when:
- The implementation matches the requested behavior.
- The UI follows the shared design system.
- Light and Dark themes work correctly where applicable.
- The layout is responsive.
- Loading, error, empty, and success states are handled where relevant.
- TypeScript and lint checks pass, when available.
- No unnecessary files, packages, or unrelated changes are introduced.


<!-- END:nextjs-agent-rules -->
