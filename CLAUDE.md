# CLAUDE.md - Development Instructions

## Coding Guidelines for Sports Leagues Project

### Technology Stack

- **Framework**: React Router v7
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **Build Tool**: Vite

### Project Structure

```
app/
├── components/          # Reusable UI components
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── routes/             # React Router pages
└── app.css            # Global styles
```

### Component Development Rules

1. **Use shadcn/ui components** - Always prefer shadcn/ui components over custom implementations
2. **TypeScript required** - All components must have proper TypeScript typing
3. **Component-based architecture** - Break down complex features into smaller, reusable components
4. **Responsive design** - Use Tailwind's responsive classes (sm:, md:, lg:, xl:)
5. **Professional styling** - Follow shadcn/ui patterns for consistent design

### API Integration

- All API calls go through `app/services/api.ts`
- Implement caching for API responses (5-minute duration)
- Handle loading states and errors gracefully
- Use proper TypeScript types from `app/types/index.ts`

### State Management

- Use React hooks (useState, useEffect, useMemo) for component state
- Keep state as close to where it's used as possible
- Use useMemo for expensive computations like filtering

### Styling Guidelines

- **Primary**: Use Tailwind CSS classes
- **Components**: Use shadcn/ui components exclusively
- **Responsive**: Mobile-first approach with responsive breakpoints
- **Accessibility**: Ensure proper ARIA labels and semantic HTML

### Code Quality

- **Comments**: Add comments when necessary for complex logic
- **Error handling**: Implement proper error boundaries and user-friendly error messages
- **Loading states**: Always show loading indicators for async operations
- **Performance**: Use caching and memoization where appropriate
- **Testing**: Write unit tests for all components and services using Vitest and React Testing Library
- **Formatting**: Use Prettier for consistent code formatting
- **Linting**: Use ESLint with TypeScript and React rules for code quality

### Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run typecheck` - TypeScript validation
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues
- `npm run prettier` - Check code formatting
- `npm run prettier:fix` - Fix code formatting
- `npm run format` - Format code and fix linting issues
- `npm run check` - Run all quality checks (typecheck, lint, prettier, test)

### CI/CD Pipeline

The project includes GitHub Actions workflow that automatically runs on:

- **Push to main branch** - Full quality checks and build
- **Pull requests to main** - Full quality checks and build

**Quality Checks Include:**

- TypeScript type checking
- ESLint code quality checks
- Prettier formatting validation
- Unit test execution
- Production build verification

### DO NOT USE ANY

- Do not use any external CSS frameworks other than Tailwind CSS
- Do not use any UI libraries other than shadcn/ui
- Do not use any state management libraries (Redux, Zustand, etc.) - stick to React hooks
- Do not use any HTTP clients other than native fetch
- Do not use any animation libraries - use Tailwind animations and CSS transitions
