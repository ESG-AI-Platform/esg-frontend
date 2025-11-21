# ESLint Rules Documentation

This project follows strict ESLint rules to maintain code quality and architectural consistency.

## Import Organization Rules

### `import/order`
Enforces consistent import organization with specific grouping:

```typescript
// ✅ Correct order
import React from "react";              // 1. React (external)
import { NextRequest } from "next";     // 2. Next.js (external)
import { someLibrary } from "library";  // 3. Other external libraries

import { Button } from "@/shared/components";     // 4. Shared modules
import { HomePage } from "@/features/home";       // 5. Features
import { metadata } from "@/app/layout";          // 6. App modules

import { localHelper } from "./helper";           // 7. Relative imports
```

**Configuration:**
- Automatic alphabetical sorting within groups
- Required newlines between import groups
- Case-insensitive ordering

## Architecture Enforcement Rules

### `import/no-restricted-paths`
Enforces feature-based architecture by preventing invalid imports:

**❌ Prohibited:**
```typescript
// Shared modules cannot import from features or app
// In /src/shared/components/Button.tsx
import { HomePage } from "@/features/home"; // ❌ Error

// Features cannot import from other features directly  
// In /src/features/metrics/components/MetricsPage.tsx
import { SocialPage } from "@/features/social"; // ❌ Error
```

**✅ Allowed:**
```typescript
// Features can import from shared
import { Button } from "@/shared/components";

// App can import from features and shared
import { HomePage } from "@/features/home";
import { Button } from "@/shared/components";

// Within same feature
import { MetricsCard } from "./MetricsCard";
```

## TypeScript Rules

### `@typescript-eslint/no-unused-vars`
Prevents unused variables and parameters:
```typescript
// ✅ Correct - prefix with underscore for intentionally unused
function handleClick(_event: MouseEvent, data: string) {
  console.log(data);
}

// ❌ Error - unused variable
function badExample(event: MouseEvent, data: string) {
  console.log(data); // 'event' is unused
}
```

### `@typescript-eslint/no-explicit-any`
Warns against using `any` type:
```typescript
// ❌ Warning
const data: any = fetchData();

// ✅ Preferred
const data: UserData = fetchData();
// or
const data: unknown = fetchData();
```

## Code Quality Rules

### `prefer-const` & `no-var`
Enforces modern JavaScript practices:
```typescript
// ✅ Correct
const immutableValue = "hello";
let mutableValue = "world";

// ❌ Error
var oldStyle = "avoid";           // Use let/const instead
let unnecessaryLet = "constant";  // Use const for values that don't change
```

## File-Specific Overrides

### App Router Files
Default exports are allowed in Next.js App Router files:
```typescript
// ✅ Allowed in /src/app/**/*.tsx files
export default function Page() {
  return <div>Hello</div>;
}
```

## Running ESLint

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors where possible
npm run lint:fix

# Type checking (separate from linting)
npm run type-check
```

## IDE Integration
- Configure your IDE to show ESLint errors in real-time
- Enable auto-fix on save for better development experience
- ESLint works with TypeScript resolver for import path resolution

## Best Practices
1. **Import Organization**: Always maintain the specified import order
2. **Feature Isolation**: Keep features independent by avoiding cross-feature imports
3. **Type Safety**: Prefer explicit types over `any`
4. **Modern Syntax**: Use `const`/`let` instead of `var`
5. **Clean Code**: Remove unused variables and imports

## Architecture Guidelines

### Feature-Based Structure
The project follows a feature-based architecture where:

- **Shared modules** (`/src/shared/`) contain reusable components, utilities, and services
- **Feature modules** (`/src/features/`) contain domain-specific logic and components
- **App modules** (`/src/app/`) contain Next.js pages and layouts

### Import Hierarchy
```
App Layer (pages, layouts)
    ↓ can import from
Feature Layer (domain logic)
    ↓ can import from
Shared Layer (utilities, components)
```

### Common ESLint Errors and Solutions

#### 1. Import Order Error
```bash
# Error: Import "react" should occur before import of "@/shared/components"
```
**Solution:** Reorganize imports according to the specified order

#### 2. Restricted Path Error
```bash
# Error: Shared modules cannot import from features or app
```
**Solution:** Move the imported functionality to shared or restructure the code

#### 3. Unused Variable Error
```bash
# Error: 'event' is assigned a value but never used
```
**Solution:** Prefix with underscore `_event` or remove if truly unused

#### 4. Any Type Warning
```bash
# Warning: Unexpected any. Specify a different type
```
**Solution:** Define proper TypeScript interface or use `unknown` type

## ESLint Configuration Files

The ESLint configuration is defined in:
- `.eslintrc.json` - Main configuration file
- `tsconfig.json` - TypeScript configuration for import resolution

For more details about specific rules, refer to:
- [ESLint Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
