---
description: QA audit checklist to run after implementing each feature section
---

# QA Audit Workflow

> [!CAUTION] > **Run this audit after completing each feature section.** Do not merge code that fails any critical
> checks.

---

## 🔍 How to Perform a QA Audit

1. **Stop and review** - Read through all code changes
2. **Run automated checks** - Linting, type checking, tests
3. **Manual testing** - Test the feature in the browser
4. **Checklist review** - Go through each item below
5. **Document issues** - Note any problems found
6. **Fix before proceeding** - Address all critical issues

---

## 📋 Automated Checks

// turbo-all

Run these commands from the monorepo root:

```bash
# Type checking
pnpm turbo typecheck

# Linting
pnpm turbo lint

# Run tests
pnpm turbo test

# Build check
pnpm turbo build
```

---

## ✅ Code Quality Checklist

### TypeScript Quality

- [ ] No `any` types (use `unknown` if type is truly unknown)
- [ ] All functions have explicit return types
- [ ] Interfaces/types defined for all data structures
- [ ] No unused imports, variables, or parameters
- [ ] No `@ts-ignore` or `@ts-expect-error` without justification
- [ ] Enums used instead of string literals for fixed values

### Error Handling

- [ ] All async operations wrapped in try-catch OR handled by React Query
- [ ] Meaningful error messages (not generic "Something went wrong")
- [ ] Errors logged with context (user ID, operation, input data)
- [ ] No errors silently swallowed
- [ ] Backend throws appropriate HTTP exceptions

### Code Organization

- [ ] Functions are small and single-purpose (< 50 lines ideally)
- [ ] No duplicate code (DRY principle)
- [ ] Related code grouped together
- [ ] Clear file and folder structure
- [ ] Named exports preferred over default exports

---

## 🎨 Frontend Checklist

### Component Quality

- [ ] Components are functional (no class components)
- [ ] Props have TypeScript interface
- [ ] Proper use of hooks (no hooks in conditions)
- [ ] Memoization where appropriate (`useMemo`, `useCallback`)
- [ ] Event handlers properly typed

### Data Fetching

- [ ] API calls made through service layer (not in components)
- [ ] TanStack Query used for data fetching
- [ ] Proper query keys (hierarchical, descriptive)
- [ ] Loading states handled with skeletons
- [ ] Error states handled with error UI + retry
- [ ] Empty states handled with helpful message
- [ ] Mutations invalidate relevant queries

### UI/UX Quality

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Consistent spacing and typography
- [ ] Loading indicators for all async actions
- [ ] Disabled states for buttons during submission
- [ ] Toast notifications for success/error
- [ ] Form validation with inline error messages
- [ ] Keyboard navigation works
- [ ] Focus states visible

### Accessibility

- [ ] Semantic HTML elements used
- [ ] Images have alt text
- [ ] Interactive elements have focus styles
- [ ] Color contrast sufficient (4.5:1 minimum)
- [ ] ARIA labels where needed
- [ ] Can navigate with keyboard only

---

## 🔧 Backend Checklist

### API Design

- [ ] RESTful conventions followed
- [ ] Proper HTTP methods (GET, POST, PATCH, DELETE)
- [ ] Consistent response format
- [ ] Pagination for list endpoints
- [ ] Proper status codes (200, 201, 400, 401, 403, 404)

### DTOs & Validation

- [ ] All inputs validated with class-validator
- [ ] DTOs have `@ApiProperty` decorators
- [ ] Transform decorators for sanitization (trim, lowercase)
- [ ] Optional fields marked with `@IsOptional()`
- [ ] Array items validated with `{ each: true }`

### Security

- [ ] Protected routes have `@UseGuards(JwtAuthGuard)`
- [ ] User authorization checked (not just authentication)
- [ ] No sensitive data in responses (passwords, tokens)
- [ ] Input sanitization applied
- [ ] Rate limiting considered for sensitive endpoints

### Database

- [ ] Queries optimized (no N+1 problems)
- [ ] Proper `include` statements (not over-fetching)
- [ ] Indexes on frequently queried fields
- [ ] Transactions for multi-step operations
- [ ] Soft delete considered for important data

### Logging

- [ ] Important operations logged
- [ ] Errors logged with context
- [ ] No sensitive data in logs
- [ ] Log levels appropriate (debug, log, warn, error)

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] Service methods have unit tests
- [ ] Edge cases covered
- [ ] Error cases tested
- [ ] Mocks properly configured

### Integration Tests (if applicable)

- [ ] API endpoints tested end-to-end
- [ ] Authentication flows tested
- [ ] Error responses verified

### Manual Testing

- [ ] Feature works as expected
- [ ] Edge cases tested manually
- [ ] Different user roles tested
- [ ] Mobile responsive checked

---

## 🚨 Critical Issues (Must Fix)

These issues MUST be fixed before proceeding:

1. **Security vulnerabilities** - Auth bypasses, unprotected routes
2. **Data corruption risks** - Missing transactions, race conditions
3. **Type errors** - TypeScript compilation failures
4. **Broken functionality** - Feature doesn't work as intended
5. **Major UX problems** - Inaccessible, unusable interface

---

## ⚠️ Warnings (Should Fix)

These should be addressed but won't block:

1. **Minor code style issues**
2. **Missing edge case handling**
3. **Performance improvements**
4. **Additional test coverage**
5. **Documentation gaps**

---

## 📝 Audit Report Template

After completing the audit, document findings:

```markdown
## QA Audit Report - [Feature Name]

**Date:** YYYY-MM-DD **Auditor:** [Name/AI]

### Summary

- ✅ Automated checks: PASS/FAIL
- ✅ Code quality: X/Y items passed
- ✅ Frontend: X/Y items passed
- ✅ Backend: X/Y items passed

### Critical Issues Found

1. [Issue description and location]
2. ...

### Warnings Found

1. [Warning description]
2. ...

### Recommendations

1. [Improvement suggestion]
2. ...

### Sign-off

- [ ] All critical issues resolved
- [ ] Ready for code review
```
