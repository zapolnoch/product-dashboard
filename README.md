# Products Dashboard

A product management dashboard with authentication and CRUD operations.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vite.dev/guide/) — build tool
- [Ant Design](https://ant.design/components/overview) — UI components
- [Zustand](https://zustand.docs.pmnd.rs/) — state management
- [React Router 7](https://reactrouter.com/)
- [Biome](https://biomejs.dev/guides/getting-started/) — linter & formatter
- [Vitest](https://vitest.dev/) — Unit Tests
- [Playwright](https://playwright.dev/) — E2E Tests

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/            # Providers, global styles
├── pages/          # Page components (Login, Products)
├── shared/         # Shared API clients, assets
└── main.tsx        # Entry point
```

Path alias `@/*` maps to `src/*`.

## API

The app uses [DummyJSON](https://dummyjson.com/) as a backend:

- [Auth](https://dummyjson.com/docs/auth) — login & token refresh
- [Products](https://dummyjson.com/docs/products) — CRUD operations
