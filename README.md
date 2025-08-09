## Tree of Life Visualizer

A modern, elegant, interactive Tree of Life visualizer built with Next.js and p5.js. Animated, zoomable, and searchable with rich interactions, theming, LLM-assisted exploration, and full mobile support.

### Goals
- Explore the Tree of Life with fluid pan, zoom, and focus
- Provide rich details per taxon with images and lineage
- Enable LLM-guided learning grounded in selected context
- Offer fast search and filtering for 50k+ nodes
- Deliver a responsive, accessible, themeable UI

### Core Features
- Animated canvas rendering with p5.js (radial and rectangular layouts)
- Hover highlight, tooltips, click-to-focus, breadcrumb trail
- Control panel for layout, depth, filters, labels, animation speed, theme
- Color themes and palette presets with high-contrast mode
- Search with suggestions, jump-to-taxon, shareable URLs
- Info drawer with overview, images, lineage, and related taxa
- LLM interaction for selected focus: Q&A, compare, explain
- Mobile gestures: pinch zoom, pan, tap, long-press; bottom-sheet controls
- Keyboard navigation and reduced-motion handling

### Tech Stack
- Next.js App Router, React Server Components + Client Components
- p5.js in instance mode for rendering
- Tailwind CSS, shadcn/ui (Radix), next-themes
- Zustand for state management
- Fuse.js for fuzzy search
- Web Workers for layout and heavy search
- LLM provider via server route (OpenAI-compatible), Redis cache
- Playwright, Vitest, React Testing Library
- Vercel deploy, GitHub Actions CI

### Architecture
- Rendering: p5 instance inside a client component, progressive rendering with hierarchical culling and label virtualization
- Layout: radial and rectangular trees computed in a Web Worker, cached server-side
- Hit testing: spatial index or color-picking buffer
- State: focus node, zoom/pan, layout, filters, theme, depth, selection
- API: server routes for tree slices, taxon metadata, search, and LLM
- Data: preprocessed Open Tree of Life JSON with enrichment (e.g., Wikipedia)

### Data Pipeline
- Source: Open Tree of Life synthetic tree
- Scripts: fetch and preprocess to hierarchical JSON with stable IDs, ranks, aliases
- Optional enrichment: description and image via Wikipedia REST, cached
- Output: public/data/tree.json; server routes slice by focus and depth

### API Contracts
- GET `/api/tree?focusId=<id>&depth=<n>&layout=<radial|rect>` → nodes, edges, bbox
- GET `/api/taxon/<id>` → metadata, lineage, related
- GET `/api/search?query=<q>` → ranked taxa
- POST `/api/llm` { focusId, question } → streamed text response

### UI and UX
- Top bar: search, breadcrumbs, theme toggle, share button
- Canvas: full-height, animated, zoomable, pannable
- Control panel: desktop docked right; mobile bottom sheet
- Info panel: tabs for Overview, Images, Lineage, Similar
- Interactions: hover highlight path-to-root; click to focus and zoom-in

### Theming
- next-themes with system default and persistence
- Tailwind CSS variables for palettes and high-contrast mode
- Color by taxonomy rank, kingdom, or trait with perceptually uniform ramps

### Accessibility
- Keyboard navigation for node traversal and focus
- ARIA for UI controls and state
- Screen reader fallback lists of nodes and lineage
- Reduced motion preference honored

### Performance
- Progressive rendering by depth and viewport
- Offscreen buffers for static layers, batched draw calls
- requestAnimationFrame scheduling and dynamic LOD thresholds
- Worker layout, cached slices, fast search via Fuse.js and indexing

### LLM Integration
- Provider-agnostic server route with environment-configured keys
- Grounding with selected focus, lineage, and cached summaries
- Tools: compare taxa, explain simply, find related or interesting neighbors
- Caching, rate limiting, and streaming responses

### Project Structure
- `app/`
  - `layout.tsx`, `page.tsx`
  - `api/llm/route.ts`
  - `api/search/route.ts`
  - `api/taxon/[id]/route.ts`
  - `api/tree/route.ts`
- `components/`
  - `TreeCanvas.tsx`
  - `ControlPanel.tsx`, `InfoPanel.tsx`, `SearchBar.tsx`, `ThemeToggle.tsx`
  - `Tooltip.tsx`, `Breadcrumbs.tsx`, `MobileSheet.tsx`
- `store/`
  - `useAppStore.ts`
- `lib/`
  - `layout/radial.ts`, `layout/rectangular.ts`
  - `tree/query.ts`, `tree/serialize.ts`
  - `llm.ts`, `wikipedia.ts`, `cache.ts`
- `workers/`
  - `layout.worker.ts`, `search.worker.ts`
- `public/data/`
  - `tree.json`
- `styles/`
  - `globals.css`, `themes.css`
- `scripts/`
  - `fetch_otol.ts`, `preprocess_tree.ts`
- `tests/`
- `README.md`

### Getting Started

#### Prerequisites
- Node.js 20+
- pnpm or npm
- Optional: Redis (e.g., Upstash)

#### Scaffold
```bash
pnpm create next-app@latest tree-of-life --ts --eslint --tailwind --app --src-dir false --import-alias @/*
cd tree-of-life
```

#### Install Dependencies
```bash
pnpm add p5 zustand fuse.js next-themes @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-slider @radix-ui/react-tabs class-variance-authority clsx tailwind-merge
pnpm add -D @types/p5 @testing-library/react @testing-library/jest-dom vitest playwright @playwright/test
```

#### UI Kit (shadcn/ui)
```bash
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button input slider tabs dialog popover tooltip sheet switch select breadcrumb
```

#### Environment
Create `.env.local`:
```bash
OPENAI_API_KEY=your_key
REDIS_URL=your_url
REDIS_TOKEN=your_token
```

#### Data
```bash
mkdir -p public/data scripts
# Add scripts/fetch_otol.ts and scripts/preprocess_tree.ts, then run:
pnpm tsx scripts/fetch_otol.ts
pnpm tsx scripts/preprocess_tree.ts
```

#### Dev
```bash
pnpm dev
```

### Implementation Notes
- p5 runs only on the client, import dynamically with `ssr: false`
- Use instance mode and avoid global sketch state
- Compute layouts in a Web Worker and stream results to the canvas

### Incremental Milestones Checklist

#### Milestone 0 — Hello Canvas Demo
- [ ] Scaffold Next.js app with Tailwind and shadcn/ui
- [ ] Add base `layout.tsx` and `page.tsx`
- [ ] Create client `TreeCanvas.tsx` using dynamic import with `ssr: false`
- [ ] Render full-viewport p5 canvas and draw an animated circle
- [ ] Add FPS toggle in a simple top bar

#### Milestone 1 — Pan/Zoom Scaffold
- [ ] Implement wheel zoom and mouse drag pan in p5 instance mode
- [ ] Add reset view button
- [ ] Add bounds and smoothing for camera transforms

#### Milestone 2 — Data Bootstrapping
- [ ] `scripts/fetch_otol.ts` downloads small sample tree
- [ ] `scripts/preprocess_tree.ts` outputs `public/data/tree.json` with ids, names, ranks
- [ ] Client loads JSON and memoizes in store
- [ ] Render nodes as points with placeholder positions

#### Milestone 3 — Radial Layout
- [ ] Implement `lib/layout/radial.ts` for node positions
- [ ] Move layout to `workers/layout.worker.ts`
- [ ] Draw edges and nodes in radial layout
- [ ] Progressive rendering by depth

#### Milestone 4 — Interaction
- [ ] Spatial index for hover hit-testing
- [ ] Hover highlight for node and path-to-root
- [ ] `Tooltip` with name and rank
- [ ] Click to focus with smooth zoom to node
- [ ] `Breadcrumbs` show lineage

#### Milestone 5 — Control Panel
- [ ] Docked panel on desktop; bottom sheet on mobile
- [ ] Controls: layout mode, max depth, labels toggle, animation speed
- [ ] Keyboard shortcuts help modal

#### Milestone 6 — Rectangular Layout
- [ ] Implement `lib/layout/rectangular.ts`
- [ ] Animated transition between radial and rectangular
- [ ] Persist choice in Zustand and URL params

#### Milestone 7 — Search
- [ ] Index names and aliases with Fuse.js
- [ ] `SearchBar` with debounced suggestions
- [ ] Jump-to-taxon centers on node
- [ ] `/api/search` server route fallback

#### Milestone 8 — Info Panel and Enrichment
- [ ] `InfoPanel` tabs: Overview, Images, Lineage, Similar
- [ ] `/api/taxon/[id]` merges local data with Wikipedia REST
- [ ] Cache Wikipedia results
- [ ] Lazy-load images with attribution

#### Milestone 9 — Theming
- [ ] `next-themes` with system default and persistence
- [ ] `ThemeToggle` in top bar
- [ ] Color-by: taxonomy rank, kingdom, or trait palettes
- [ ] High-contrast theme and smooth transitions

#### Milestone 10 — Mobile Support
- [ ] Pinch-to-zoom and inertial panning
- [ ] Tap and long-press actions
- [ ] Touch-friendly hit targets
- [ ] Bottom sheet controls refined

#### Milestone 11 — LLM Interaction
- [ ] `/api/llm` streaming route
- [ ] Prompt grounding with focus node and lineage
- [ ] LLM drawer UI with suggested prompts
- [ ] Rate limiting and response caching

#### Milestone 12 — Performance
- [ ] Offscreen buffers for static layers
- [ ] Level-of-detail thresholds for nodes and labels
- [ ] Color-picking buffer or KD-tree tuning for hit testing
- [ ] Performance HUD and metric logging

#### Milestone 13 — Accessibility
- [ ] Keyboard navigation between nodes and UI controls
- [ ] ARIA labels and roles for interactive elements
- [ ] Reduced-motion handling
- [ ] Screen reader textual fallback of lineage

#### Milestone 14 — Share and Persist
- [ ] URL params for focus, zoom, layout, depth, theme
- [ ] Share link button copies current state
- [ ] Local storage for session restore

#### Milestone 15 — Quality and Delivery
- [ ] Unit tests for layout math and state reducers
- [ ] Integration tests for hover/click/search flows
- [ ] E2E tests for desktop and mobile
- [ ] GitHub Actions CI, Vercel deploy
- [ ] Analytics with opt-out toggle

### Acceptance Criteria
- 50k+ nodes smooth on desktop and usable on modern mobile
- Hover highlight under 16ms, click-to-focus stable frame under 300ms
- Search results under 100ms for 50k taxa
- LLM first token under 3s with grounded context
- WCAG AA color contrast and keyboard operability
- Theming persists and share links restore state

### Future Extensions
- Time slider for evolutionary timelines
- Phylogenetic uncertainty visualization
- User annotations and saved views
- Export to PNG/SVG and share cards
