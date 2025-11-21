# ESG Frontend

## 📋 Overview
ESG Management Platform is a Next.js application for tracking, managing, and reporting Environmental, Social, and Governance (ESG) metrics for organizations.

## 🛠️ Technology Stack
- **Framework**: Next.js 14.0.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Authentication**: JWT Token-based

## 📁 Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/         # Authentication demo page
│   ├── metrics/           # ESG metrics page
│   ├── reports/           # Governance reports page
│   └── social/            # Social impact page
├── features/              # Feature modules
│   ├── home/              # Home page
│   ├── metrics/           # Environmental metrics
│   ├── reports/           # Reports and governance
│   └── social/            # Social impact
└── shared/                # Shared components and utilities
    ├── components/        # UI Components (Button, Card, etc.)
    ├── hooks/             # Custom React Hooks
    ├── services/          # API Services
    └── types/             # TypeScript Type definitions
```

## 🚀 Installation and Usage

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd esg-frontend

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Commands
```bash
npm run dev          # Run development server
npm run build        # Build for production
npm run start        # Run production server
npm run lint         # Check code quality
npm run type-check   # Check TypeScript types
```

## 📋 Code Quality & Standards

### ESLint Rules
This project follows strict ESLint rules for code quality and architectural consistency. 

📖 **Detailed documentation:** [ESLINT_RULES.md](./ESLINT_RULES.md)

**Quick commands:**
```bash
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
```

### Key Standards
- **Import Organization**: Consistent import ordering and grouping
- **Feature-Based Architecture**: Strict separation between shared, features, and app layers
- **TypeScript**: Prefer explicit types over `any`
- **Modern JavaScript**: Use `const`/`let` instead of `var`