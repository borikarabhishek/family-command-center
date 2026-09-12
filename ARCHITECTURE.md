# FamilyOS Architecture Overview

**Version**: 1.0.0-alpha  
**Last Updated**: September 9, 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Key Components & Modules](#key-components--modules)
5. [Data Flow](#data-flow)
6. [Styling Architecture](#styling-architecture)
7. [Routing](#routing)
8. [State Management](#state-management)
9. [Error Handling](#error-handling)
10. [Development Workflow](#development-workflow)

---

## Project Overview

**FamilyOS** is a technology-first Multi-Family Office (MFO) platform designed for ordinary Indian families. It acts as a private operating system coordinating a family's:

- Financial information & tracking
- Document management & vault
- Legal matters & contracts
- Professional services marketplace
- Family communication & approvals
- Assets and liabilities tracking
- Education, travel, business planning

### Design Philosophy

- **Premium but accessible** - Professional, trustworthy UI
- **Mobile-first** - Optimized for phone, fully responsive
- **Fintech aesthetic** - Clear information hierarchy, strong typography
- **Mockdata-driven** - MVP uses realistic demo data, ready for real APIs

---

## Technology Stack

### Frontend

| Layer              | Technology      | Version  | Purpose                            |
| ------------------ | --------------- | -------- | ---------------------------------- |
| **Language**       | TypeScript      | 5.8.3    | Type safety & developer experience |
| **UI Framework**   | React           | 19.2.0   | Component-based UI                 |
| **Routing**        | TanStack Router | 1.170.18 | Type-safe SPA routing              |
| **Build Tool**     | Vite            | 8.1.5    | Fast bundling & dev server         |
| **Styling**        | Tailwind CSS    | 4.2.1    | Utility-first CSS framework        |
| **Components**     | Radix UI        | Latest   | Accessible, unstyled components    |
| **Forms**          | React Hook Form | 7.71.2   | Efficient form state management    |
| **Validation**     | Zod             | 3.24.2   | TypeScript-first schema validation |
| **State (Server)** | TanStack Query  | 5.101.1  | Server state synchronization       |
| **Icons**          | Lucide React    | 0.575.0  | Beautiful SVG icon library         |
| **Charting**       | Recharts        | 2.15.4   | React charts for financial data    |
| **Notifications**  | Sonner          | 2.0.7    | Toast notifications                |

### Development & Testing

| Tool                  | Version               | Purpose |
| --------------------- | --------------------- | ------- |
| **Testing Framework** | Vitest                | 1.6.0   | Fast unit testing              |
| **Component Testing** | React Testing Library | 16.0.1  | Accessible component tests     |
| **Coverage**          | @vitest/coverage-v8   | 1.6.0   | Code coverage reporting        |
| **Linting**           | ESLint                | 9.32.0  | Code quality checks            |
| **Formatting**        | Prettier              | 3.7.3   | Code formatting                |
| **Runtime**           | Bun                   | Latest  | Fast package manager & runtime |

### Server

| Component      | Technology            |
| -------------- | --------------------- |
| **Framework**  | Nitro                 | 3.0.260603-beta            |
| **Build**      | Vite + TanStack Start | Full-stack React framework |
| **Deployment** | Lovable.dev           | Connected visual editor    |

---

## Directory Structure

```
family-command-center/
├── src/
│   ├── components/
│   │   ├── ui/                    # Radix-based UI components (46 files)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   └── ... (43 more)
│   │   ├── common/                # Shared business components (5 files)
│   │   │   ├── PageHeader.tsx     # Page title + action
│   │   │   ├── StatCard.tsx       # Metric display
│   │   │   ├── EmptyState.tsx     # Placeholder state
│   │   │   ├── StatusBadge.tsx    # Colored status indicator
│   │   │   └── DemoNotice.tsx     # Prototype disclaimer
│   │   ├── layout/
│   │   │   └── AppShell.tsx       # Root layout (sidebar + mobile nav)
│   │   ├── ErrorBoundary.tsx      # Error boundary for crash handling
│   │   ├── RouteErrorFallback.tsx # Route-level error UI
│   │   └── FilterButton.tsx       # Reusable filter toggle
│   │
│   ├── routes/                    # Page components (TanStack Router)
│   │   ├── __root.tsx             # Root layout route
│   │   ├── index.tsx              # Onboarding (home)
│   │   ├── dashboard.tsx          # Main dashboard
│   │   ├── family.tsx             # Family members page
│   │   ├── family.index.tsx       # Family list view
│   │   ├── family.$memberId.tsx   # Family member detail
│   │   ├── financial.tsx          # Financial overview
│   │   ├── vault.tsx              # Document vault
│   │   ├── tasks.tsx              # Tasks & approvals
│   │   ├── services.tsx           # Professional services
│   │   ├── messages.tsx           # Communication
│   │   ├── calendar.tsx           # Family calendar
│   │   ├── settings.tsx           # User settings
│   │   └── more.tsx               # Additional pages
│   │
│   ├── hooks/                     # Custom React hooks (empty - ready for addition)
│   │
│   ├── lib/
│   │   ├── utils.ts               # `cn()` for Tailwind merging
│   │   ├── format.ts              # India-specific formatting (INR, dates, initials)
│   │   ├── validation.ts          # Zod schemas for form validation
│   │   ├── error-capture.ts       # Error catching & logging
│   │   ├── error-page.ts          # Error page utilities
│   │   └── lovable-error-reporting.ts  # Error reporting to Lovable IDE
│   │
│   ├── data/
│   │   ├── types.ts               # TypeScript domain models
│   │   ├── demo.ts                # Mock/demo data (realistic family scenario)
│   │   ├── constants.ts           # Application-wide constants (NEW)
│   │   └── demo.helpers.ts        # Helper functions for data queries (NEW)
│   │
│   ├── router.tsx                 # TanStack Router configuration
│   ├── routeTree.gen.ts           # Auto-generated route tree
│   ├── server.ts                  # Server entry point with SSR error handling
│   ├── start.ts                   # Client entry point
│   └── styles.css                 # Global styles
│
├── test/
│   └── setup.ts                   # Vitest configuration & browser mocks
│
├── public/                        # Static assets
│
├── vitest.config.ts               # Vitest configuration
├── vite.config.ts                 # Vite configuration (extends Lovable preset)
├── tsconfig.json                  # TypeScript configuration (strict mode)
├── eslint.config.js               # ESLint rules
├── .prettierrc                     # Prettier formatting rules
├── bunfig.toml                    # Bun runtime configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # Setup & overview
```

---

## Key Components & Modules

### UI Components Library (`src/components/ui/`)

Radix UI-based, unstyled components with Tailwind styling. All wrapped for consistency:

- **Navigation**: Menubar, NavigationMenu
- **Forms**: Input, Label, Form, Select, Checkbox, RadioGroup, Toggle
- **Dialogs**: Dialog, Drawer, AlertDialog
- **Data**: Table, Tabs
- **Visualization**: Chart (custom Recharts wrapper), Progress, Slider
- **Feedback**: Tooltip, Popover, HoverCard
- **Layout**: Sidebar, Separator, ScrollArea, ResizablePanels

All 46 components provide:

- Keyboard navigation support
- ARIA labels & attributes
- Dark/light mode support (via Tailwind tokens)

### Common Components (`src/components/common/`)

Business-domain components shared across pages:

- **PageHeader**: Page titles with description and action button
- **StatCard**: Dashboard metrics display
- **EmptyState**: Placeholder UI for empty lists
- **StatusBadge**: Colored status indicators (auto-tone based on text)
- **DemoNotice**: Prototype data disclaimer banner

All include JSDoc documentation.

### Error Handling

**ErrorBoundary** (React 16.8+ class component):

- Catches JavaScript errors in component tree
- Displays fallback UI
- Logs errors for monitoring
- Supports custom error handler callback

**RouteErrorFallback** (TanStack Router integration):

- Handles 404 and route-level errors
- Provides recovery options (reload, go home)
- Dev-only error details view

---

## Data Flow

### Data Sources

1. **Mock Data** (`src/data/demo.ts`)
   - Realistic family scenario (The Rao Family, Pune)
   - 4 family members, 15+ documents, 10+ tasks
   - Multiple data types: tasks, documents, assets, approvals, etc.

2. **Helper Functions** (`src/data/demo.helpers.ts`)
   - `getMemberDocuments(memberId)`
   - `getMemberTasks(memberId)`
   - `getMemberAssets(memberId)`
   - `searchDocuments(query, category)`
   - etc.

### State Management

**React Context**: None yet (ready for addition if needed)

**Component State**:

- useState for local UI state (filters, form inputs)
- useReducer for complex state (Phase 2 planned for onboarding)

**Server State**:

- TanStack Query ready (queries already configured)
- Currently uses mock data directly
- Ready for real API integration

---

## Styling Architecture

### Design System

Built on Tailwind CSS 4.2.1 with custom tokens:

**Colors** (Tailwind CSS variables):

- `primary` / `primary-foreground` - Brand color
- `secondary` / `secondary-foreground` - Supporting color
- `accent` - Highlights
- `destructive` / `warning` / `success` / `info` - Semantic colors
- `muted` / `muted-foreground` - Disabled/secondary text
- `background` / `foreground` - Base colors
- `border` / `card` / `sidebar` - Component backgrounds

**Spacing**: Tailwind standard (4px baseline)

**Typography**:

- Sans-serif font stack
- Utility classes: `.label-caps`, `.numeric`
- Display font for numbers/stats

### Responsive Design

Mobile-first approach:

- `sm:` - Small devices (~640px)
- `md:` - Medium devices (~768px)
- `lg:` - Large devices (~1024px)
- `xl:` - Extra large (~1280px)

Example: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

---

## Routing

### TanStack Router (Type-Safe)

**Structure**:

- File-based routing in `src/routes/`
- Automatic route tree generation (`routeTree.gen.ts`)
- Nested routes via directory convention

**Key Routes**:

```
/
├── / (onboarding/home)
├── /dashboard
├── /family
│   ├── /family (index list)
│   └── /family/:memberId (detail)
├── /financial
├── /vault
├── /tasks
├── /services
├── /calendar
├── /messages
├── /settings
└── /more
```

**Error Handling**:

- Route-level error boundaries
- Loader functions with validation
- errorComponent fallback

---

## State Management

### Current Approach

1. **Component State** (`useState`)
   - Filter selections (category, status)
   - Form inputs
   - Modal/drawer open/close

2. **Mock Data** (imported directly)
   - No real API calls yet
   - Ready for TanStack Query integration

### Future Integration

When connecting to real APIs:

```typescript
// Replace direct imports with queries:
const { data: documents } = useQuery({
  queryKey: ["documents"],
  queryFn: () => api.getDocuments(),
});
```

---

## Error Handling

### Layers

1. **Root Error Boundary** (`__root.tsx`)
   - Catches unhandled component errors
   - Displays error page with details

2. **Route Error Boundaries** (Per-route)
   - Catches route-specific errors
   - Handles 404/validation failures
   - Provides recovery UI

3. **Data Validation** (Zod)
   - Form input validation with user-friendly errors
   - Safe error message extraction
   - Type-safe result handling

4. **Error Logging** (`lib/error-capture.ts`)
   - Centralized error capturing
   - TTL-based deduplication
   - Lovable IDE integration

---

## Development Workflow

### Setup

```bash
bun install
npm run dev           # Start dev server
npm run build        # Production build
npm run lint         # Check code quality
npm run format       # Auto-format code
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Architecture Principles

1. **Separation of Concerns**
   - Components: UI rendering
   - Routes: Page logic
   - Lib: Utilities & formatting
   - Data: Mock/API calls

2. **Reusability**
   - Extract common patterns to components
   - Use type-safe constants
   - Share helper functions

3. **Type Safety**
   - Strict TypeScript mode
   - Zod for runtime validation
   - Typed props throughout

4. **Accessibility**
   - ARIA labels on interactive elements
   - Keyboard navigation support
   - Semantic HTML where possible
   - Color contrast verification

5. **Testing** (In Progress)
   - Unit tests for utilities
   - Component tests for UI
   - Integration tests for flows

---

## Performance Considerations

### Optimizations

- **Code Splitting**: Vite automatically chunks routes
- **Tree-Shaking**: Unused code removed at build
- **CSS Purging**: Tailwind removes unused styles
- **Image Optimization**: SVG icons (Lucide)
- **No External CDNs**: All packages bundled

### Monitoring Ready

- Web Vitals instrumentation points
- Error tracking setup
- Performance monitoring hooks

---

## Deployment

### Lovable.dev Integration

- Pushes to `improve/comprehensive-audit` branch sync with Lovable
- Visual editor for design/layout changes
- Automatic builds on commit

### Build Process

```
Source → TypeScript Compilation
→ React JSX Transform (Vite plugin)
→ Tailwind Purging
→ Code Splitting
→ Minification → HTML/JS/CSS bundles
```

### Environment

**Development**: `npm run dev`

- HMR (Hot Module Replacement)
- Source maps
- Dev error details

**Production**: `npm run build`

- Optimized output
- Minified assets
- Source maps (optional)

---

## Next Steps for Development

1. **Phase 2** (In Progress)
   - ✅ Extract constants
   - ✅ Add JSDoc documentation
   - ✅ Create helper functions
   - ⏳ Break down monolithic components

2. **Phase 3**
   - Add accessibility improvements
   - Expand README with setup guide
   - Add more error handling

3. **Phase 4**
   - Write unit tests
   - Write component tests
   - Add integration tests
   - Target 70%+ coverage

4. **Phase 5** (Future)
   - Connect real APIs
   - Add authentication
   - Implement file uploads
   - Add real notifications

---

**For questions or improvements, see the project README and related documentation.**
