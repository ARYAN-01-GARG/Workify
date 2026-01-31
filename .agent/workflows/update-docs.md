---
description: How to maintain and update project documentation at the end of a feature build
---

# Documentation Update Workflow

Follow this checklist at the end of every feature implementation or major refactor.

## 1. Update Progress Report (`docs/progress.md`)

- [ ] **Mark Completed**: Move the feature from "Pending" to "Implemented Features".
- [ ] **Detail**: Add specific capabilities added (e.g., "Real-time chat via WebSockets").
- [ ] **Next Steps**: Update the "Summary of Next Steps" if new requirements emerge.

## 2. Update Database Schema Documentation (`docs/schema.md`)

- [ ] **Check Changes**: If `packages/db/prisma/schema.prisma` was modified.
- [ ] **Sync**: Copy the entire content of `schema.prisma` into `docs/schema.md`.
- [ ] **Verify**: Ensure all new models and enums are present.

## 3. Verify System Consistency

- [ ] **Build Check**: Ensure `pnpm build` passes before documenting as "Complete".
- [ ] **Lint Check**: Run `pnpm lint` to ensure code quality.

## Example Command for Schema Update

If you have made changes to the schema, you can quickly update the doc:

```bash
cat packages/db/prisma/schema.prisma > docs/schema.md
```
