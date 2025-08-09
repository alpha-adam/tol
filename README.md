# Tree of Life Visualizer

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![p5.js](https://img.shields.io/badge/p5.js-1.7-ed225d)](https://p5js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, elegant, interactive Tree of Life visualizer built with Next.js and p5.js. Explore 50,000+ taxa with fluid animations, rich interactions, and LLM-assisted learning.

[Live Demo](#) | [Documentation](docs/) | [Report Bug](https://github.com/alpha-adam/tol/issues) | [Request Feature](https://github.com/alpha-adam/tol/issues)

![Tree of Life Visualizer Demo](public/demo.gif)

## ✨ Features

### Currently Implemented (Milestone 0)
- ✅ Next.js 15 with TypeScript and strict mode
- ✅ p5.js visualization with instance mode
- ✅ Responsive canvas with resize handling
- ✅ FPS counter overlay
- ✅ Animated test visualization

### Planned Features
- 🌳 **50,000+ Taxa** - Explore the complete Tree of Life with smooth performance
- 🎨 **Multiple Layouts** - Switch between radial and rectangular tree visualizations
- 🔍 **Smart Search** - Fuzzy search with instant suggestions and jump-to-taxon
- 🤖 **LLM Integration** - Learn about taxa with AI-powered explanations
- 🎯 **Rich Interactions** - Hover, click, zoom, pan with mouse and touch
- 🌙 **Theming** - Light/dark modes with customizable color palettes
- 📱 **Mobile First** - Full touch support with responsive UI
- ♿ **Accessible** - Keyboard navigation and screen reader support
- 🚀 **Fast** - Progressive rendering, Web Workers, and optimized hit-testing
- 🔗 **Shareable** - Deep linking to specific taxa and view states

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm
- Optional: Redis for caching (e.g., [Upstash](https://upstash.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/alpha-adam/tol.git
cd tol

# Install dependencies
npm install

# Set up environment variables (optional for LLM features)
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

**Note:** Tree data fetching and preprocessing scripts will be implemented in Milestone 2.

Open [http://localhost:3000](http://localhost:3000) to see the visualizer.

### Environment Variables

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key      # For LLM features
REDIS_URL=your_redis_url                # Optional: For caching
REDIS_TOKEN=your_redis_token            # Optional: For caching
NEXT_PUBLIC_ANALYTICS_ID=your_id        # Optional: Analytics
```

## 📖 Documentation

For detailed documentation, see the [docs/](docs/) directory:

- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)

## 🎯 Goals
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

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript type checking
```

### Project Setup from Scratch

<details>
<summary>Click to expand detailed setup instructions</summary>

#### 1. Create Next.js App
```bash
npx create-next-app@latest tree-of-life --ts --eslint --tailwind --app --no-src-dir --import-alias @/*
cd tree-of-life
```

#### 2. Install Core Dependencies
```bash
# Runtime dependencies
npm install p5 zustand fuse.js next-themes 
npm install @radix-ui/react-dialog @radix-ui/react-popover 
npm install @radix-ui/react-slider @radix-ui/react-tabs 
npm install class-variance-authority clsx tailwind-merge

# Development dependencies
npm install -D @types/p5

# Note: Additional dev dependencies for testing will be added later
```

#### 3. Setup Project Structure
```bash
# Create necessary directories
mkdir -p components lib store types
```

#### 4. Configure Tailwind CSS
Ensure you're using Tailwind CSS v3 for compatibility with Next.js 15:
```bash
npm uninstall tailwindcss
npm install tailwindcss@^3
```

</details>

### Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL support required for canvas rendering.

## 🏗️ Implementation Notes

- **Client-side Rendering**: p5.js runs only on the client, import dynamically with `ssr: false`
- **Instance Mode**: Use p5 instance mode to avoid global state pollution
- **Web Workers**: Compute layouts and search in workers for non-blocking UI
- **Progressive Enhancement**: Server renders UI shell, canvas loads progressively
- **Caching Strategy**: Redis for LLM responses, browser cache for tree data

## 📋 Implementation Roadmap

Detailed milestone checklist for incremental development:

### Phase 1: Foundation (Milestones 0-3)

#### Milestone 0 — Project Setup & Hello Canvas ✅
- [x] Initialize Next.js 14 app with TypeScript and Tailwind CSS
- [x] Configure `tsconfig.json` with strict mode and path aliases
- [x] Set up ESLint with consistent code style rules
- [x] Create base `app/layout.tsx` with viewport meta and fonts
- [x] Create `app/page.tsx` with basic layout structure
- [x] Install p5.js and @types/p5 dependencies
- [x] Create `components/TreeCanvas.tsx` using dynamic import with `ssr: false`
- [x] Set up p5 instance mode with proper TypeScript types
- [x] Render full-viewport canvas with resize handler
- [x] Draw animated test circle to verify p5 is working
- [x] Add FPS counter overlay with toggle button
- [x] Create basic `components/TopBar.tsx` with app title

#### Milestone 1 — Camera System & Controls
- [ ] Create `lib/camera.ts` with Camera class
- [ ] Implement zoom level with min/max bounds (0.1 to 10)
- [ ] Add pan offset with x/y coordinates
- [ ] Implement wheel event handler for zoom (with preventDefault)
- [ ] Add mouse drag detection (mousePressed, mouseDragged, mouseReleased)
- [ ] Calculate world coordinates from screen coordinates
- [ ] Add smooth interpolation for zoom transitions (lerp)
- [ ] Implement velocity-based panning with friction
- [ ] Add double-click to zoom in at point
- [ ] Create reset view button that animates to origin
- [ ] Add zoom in/out buttons with consistent step size
- [ ] Display current zoom level as percentage

#### Milestone 2 — Data Architecture & Loading
- [ ] Create `types/tree.ts` with TreeNode, Edge, TaxonomicRank interfaces
- [ ] Set up `scripts/fetch_otol.ts` with node-fetch
- [ ] Fetch sample newick tree from Open Tree of Life API
- [ ] Parse newick format into hierarchical structure
- [ ] Create `scripts/preprocess_tree.ts` for data transformation
- [ ] Generate stable IDs for each node (using path or hash)
- [ ] Extract taxonomic ranks from OTT metadata
- [ ] Calculate tree statistics (depth, node count, leaf count)
- [ ] Output formatted JSON to `public/data/tree.json`
- [ ] Create `lib/tree/loader.ts` for client-side loading
- [ ] Implement tree data validation and error handling
- [ ] Set up Zustand store with `store/useTreeStore.ts`
- [ ] Add loading states and error boundaries
- [ ] Render nodes as simple circles at random positions

#### Milestone 3 — Radial Layout Algorithm
- [ ] Create `lib/layout/types.ts` with Layout interface
- [ ] Implement `lib/layout/radial.ts` with RadialLayout class
- [ ] Calculate tree depth using BFS traversal
- [ ] Assign angular positions using equal angle subdivision
- [ ] Calculate radial distance based on depth level
- [ ] Handle leaf node distribution to avoid overlap
- [ ] Implement Reingold-Tilford algorithm for better spacing
- [ ] Add layout caching with node position Map
- [ ] Create `workers/layout.worker.ts` with message protocol
- [ ] Move layout computation to Web Worker
- [ ] Stream layout results back to main thread progressively
- [ ] Draw edges as lines between parent-child nodes
- [ ] Style nodes based on type (internal vs leaf)
- [ ] Add smooth animation when layout completes
- [ ] Implement level-of-detail rendering by depth

### Phase 2: Core Interactions (Milestones 4-7)

#### Milestone 4 — Hit Testing & Hover
- [ ] Create `lib/hit-test/spatial-index.ts` with QuadTree implementation
- [ ] Build spatial index from node positions
- [ ] Implement point-in-circle hit detection
- [ ] Add mouse move handler with hit testing
- [ ] Track hovered node in component state
- [ ] Highlight hovered node with larger radius
- [ ] Create `lib/tree/traversal.ts` with path-to-root function
- [ ] Highlight entire path from node to root on hover
- [ ] Style path with increased stroke width and opacity
- [ ] Create `components/Tooltip.tsx` with Radix UI
- [ ] Show tooltip with node name and rank on hover
- [ ] Position tooltip to avoid viewport edges
- [ ] Add delay before showing/hiding tooltip
- [ ] Clear highlights when mouse leaves canvas

#### Milestone 5 — Focus & Navigation
- [ ] Add focusedNode state to tree store
- [ ] Implement click handler to set focused node
- [ ] Create `lib/animation/tween.ts` for smooth transitions
- [ ] Animate camera to center on clicked node
- [ ] Calculate appropriate zoom level for focused node
- [ ] Create `components/Breadcrumbs.tsx` component
- [ ] Build breadcrumb trail from focused node to root
- [ ] Make breadcrumb items clickable for navigation
- [ ] Add keyboard event listeners (arrow keys)
- [ ] Implement node traversal with up/down/left/right
- [ ] Add Enter key to focus current node
- [ ] Add Escape key to clear focus
- [ ] Create focus ring visual indicator
- [ ] Sync focused node with URL hash parameter

#### Milestone 6 — Control Panel UI
- [ ] Create `components/ControlPanel.tsx` container
- [ ] Add collapsible sections with Radix Accordion
- [ ] Create layout mode selector (radio group)
- [ ] Add max depth slider (1-10 levels)
- [ ] Create label visibility toggle switch
- [ ] Add animation speed slider (0-2x)
- [ ] Create node size slider (0.5x-2x)
- [ ] Add edge opacity slider (0-100%)
- [ ] Implement responsive layout with CSS Grid
- [ ] Create mobile-specific `components/MobileSheet.tsx`
- [ ] Use Radix Sheet for bottom drawer on mobile
- [ ] Add swipe gestures for opening/closing
- [ ] Create keyboard shortcuts modal dialog
- [ ] Display all available shortcuts with descriptions

#### Milestone 7 — Rectangular Layout
- [ ] Create `lib/layout/rectangular.ts` with RectangularLayout class
- [ ] Implement tidier tree algorithm for positioning
- [ ] Calculate x positions based on tree structure
- [ ] Calculate y positions based on depth
- [ ] Handle variable node sizes in layout
- [ ] Add horizontal and vertical spacing parameters
- [ ] Create smooth transition between layouts
- [ ] Interpolate node positions during transition
- [ ] Morph edge paths during transition
- [ ] Add layout toggle to control panel
- [ ] Persist layout preference in localStorage
- [ ] Update URL params with layout choice
- [ ] Optimize rectangular layout for wide trees
- [ ] Add compact mode for dense visualization

### Phase 3: Search & Discovery (Milestones 8-10)

#### Milestone 8 — Search Implementation
- [ ] Install and configure Fuse.js
- [ ] Create `lib/search/indexer.ts` for building search index
- [ ] Index node names, common names, and synonyms
- [ ] Configure fuzzy search parameters
- [ ] Create `components/SearchBar.tsx` with Radix Combobox
- [ ] Implement debounced search input
- [ ] Display search suggestions in dropdown
- [ ] Show match score and highlight matched text
- [ ] Add keyboard navigation for suggestions
- [ ] Implement "jump to taxon" on selection
- [ ] Create `app/api/search/route.ts` endpoint
- [ ] Add server-side search as fallback
- [ ] Cache frequent searches in memory
- [ ] Add search history with recent searches
- [ ] Create clear search button

#### Milestone 9 — Info Panel & Enrichment
- [ ] Create `components/InfoPanel.tsx` with Radix Tabs
- [ ] Design Overview tab with basic taxon info
- [ ] Add taxonomic rank and classification
- [ ] Display number of descendants and siblings
- [ ] Create Images tab with lazy loading
- [ ] Implement `lib/wikipedia.ts` for fetching data
- [ ] Fetch Wikipedia extract and main image
- [ ] Add image attribution and license info
- [ ] Create Lineage tab with ancestor list
- [ ] Make lineage items clickable for navigation
- [ ] Create Similar tab with related taxa
- [ ] Calculate similarity based on tree distance
- [ ] Create `app/api/taxon/[id]/route.ts` endpoint
- [ ] Implement Redis caching for Wikipedia data
- [ ] Add loading skeletons for async content
- [ ] Handle errors gracefully with fallbacks

#### Milestone 10 — Advanced Search Features
- [ ] Add search filters (rank, kingdom, etc.)
- [ ] Implement advanced query syntax
- [ ] Create search results page/modal
- [ ] Add pagination for large result sets
- [ ] Implement search highlighting in tree
- [ ] Dim non-matching nodes
- [ ] Create "Find in tree" feature
- [ ] Add regular expression search support
- [ ] Create saved searches functionality
- [ ] Export search results as CSV/JSON
- [ ] Add search analytics tracking
- [ ] Create search suggestions based on context
- [ ] Implement "Did you mean?" corrections
- [ ] Add phonetic search for scientific names

### Phase 4: Visual Enhancement (Milestones 11-13)

#### Milestone 11 — Theming System
- [ ] Set up next-themes provider
- [ ] Create theme context and hooks
- [ ] Define CSS variables for colors
- [ ] Create light theme palette
- [ ] Create dark theme palette
- [ ] Add theme toggle button to top bar
- [ ] Implement smooth theme transitions
- [ ] Create `components/ThemeCustomizer.tsx`
- [ ] Add preset color schemes
- [ ] Create color-by-rank mode
- [ ] Create color-by-kingdom mode
- [ ] Add custom color picker
- [ ] Implement high-contrast mode
- [ ] Save theme preferences to localStorage

#### Milestone 12 — Visual Enhancements
- [ ] Add node icons based on taxonomic rank
- [ ] Create custom SVG icons for major groups
- [ ] Implement node clustering for dense areas
- [ ] Add expand/collapse for clusters
- [ ] Create heat map visualization mode
- [ ] Color nodes by evolutionary age
- [ ] Add branch length visualization
- [ ] Show confidence scores on edges
- [ ] Create minimap overview component
- [ ] Add grid background option
- [ ] Implement focus highlight effects
- [ ] Add particle effects for transitions
- [ ] Create screenshot capture feature
- [ ] Add watermark option for exports

#### Milestone 13 — Label System
- [ ] Create intelligent label placement algorithm
- [ ] Avoid label overlap with force simulation
- [ ] Implement label level-of-detail (LOD)
- [ ] Show more labels when zoomed in
- [ ] Add label background for readability
- [ ] Create curved labels for radial layout
- [ ] Add label truncation with ellipsis
- [ ] Implement label priority system
- [ ] Show important taxa labels first
- [ ] Create label style options
- [ ] Add font size controls
- [ ] Implement label search highlighting
- [ ] Add label hover effects
- [ ] Create label toggle per rank

### Phase 5: Mobile & Touch (Milestones 14-15)

#### Milestone 14 — Touch Interactions
- [ ] Detect touch device capabilities
- [ ] Implement pinch-to-zoom gesture
- [ ] Calculate zoom delta from touch distance
- [ ] Add two-finger pan support
- [ ] Implement momentum scrolling
- [ ] Add tap to select node
- [ ] Implement long-press for context menu
- [ ] Create touch-friendly hit targets (44px minimum)
- [ ] Add haptic feedback for interactions
- [ ] Optimize touch event handling
- [ ] Prevent default browser gestures
- [ ] Add gesture hints overlay
- [ ] Create tutorial for first-time users
- [ ] Test on various mobile devices

#### Milestone 15 — Mobile UI Optimization
- [ ] Create responsive breakpoints
- [ ] Adjust UI density for mobile
- [ ] Optimize control panel for touch
- [ ] Create bottom navigation bar
- [ ] Add quick action buttons
- [ ] Implement pull-to-refresh
- [ ] Create mobile-specific search UI
- [ ] Optimize info panel for mobile
- [ ] Add swipe between tabs
- [ ] Reduce animation complexity on mobile
- [ ] Implement adaptive quality settings
- [ ] Add offline support with service worker
- [ ] Cache critical assets locally
- [ ] Test on slow network connections

### Phase 6: AI & Intelligence (Milestones 16-17)

#### Milestone 16 — LLM Integration
- [ ] Create `app/api/llm/route.ts` endpoint
- [ ] Set up OpenAI SDK configuration
- [ ] Implement streaming response handler
- [ ] Create system prompt with context
- [ ] Add focused taxon information to prompt
- [ ] Include lineage and related taxa
- [ ] Create `components/AskAI.tsx` interface
- [ ] Add suggested questions/prompts
- [ ] Implement chat-like interaction
- [ ] Stream responses with markdown rendering
- [ ] Add copy response button
- [ ] Create conversation history
- [ ] Implement rate limiting with Redis
- [ ] Add usage tracking and quotas

#### Milestone 17 — AI Features
- [ ] Create taxon comparison tool
- [ ] Generate evolutionary explanations
- [ ] Add "Explain Like I'm 5" mode
- [ ] Create interesting facts generator
- [ ] Implement related taxa suggestions
- [ ] Add evolutionary timeline generator
- [ ] Create quiz/learning mode
- [ ] Generate custom tours of the tree
- [ ] Add pronunciation guides
- [ ] Create etymology explanations
- [ ] Implement smart search with NLP
- [ ] Add question answering system
- [ ] Create summary generation
- [ ] Cache AI responses for efficiency

### Phase 7: Performance (Milestones 18-19)

#### Milestone 18 — Rendering Optimization
- [ ] Implement view frustum culling
- [ ] Only render visible nodes
- [ ] Create offscreen canvas buffers
- [ ] Separate static and dynamic layers
- [ ] Implement dirty rectangle rendering
- [ ] Add request animation frame throttling
- [ ] Create frame budget system
- [ ] Batch similar draw operations
- [ ] Implement texture atlasing for icons
- [ ] Add WebGL renderer option
- [ ] Create quality presets (low/medium/high)
- [ ] Add performance monitoring HUD
- [ ] Track FPS, memory, draw calls
- [ ] Implement automatic quality adjustment

#### Milestone 19 — Data Optimization
- [ ] Implement progressive data loading
- [ ] Load tree data in chunks
- [ ] Create level-of-detail data structures
- [ ] Add data compression with gzip
- [ ] Implement virtual scrolling for lists
- [ ] Create efficient data structures
- [ ] Use TypedArrays for positions
- [ ] Implement object pooling
- [ ] Add memory management utilities
- [ ] Create cache eviction strategies
- [ ] Optimize search index size
- [ ] Use Web Assembly for heavy computation
- [ ] Add performance benchmarks
- [ ] Profile and optimize hot paths

### Phase 8: Accessibility (Milestone 20)

#### Milestone 20 — Full Accessibility
- [ ] Add skip navigation links
- [ ] Implement focus trap for modals
- [ ] Add ARIA labels to all controls
- [ ] Create screen reader announcements
- [ ] Implement roving tabindex for tree
- [ ] Add keyboard navigation instructions
- [ ] Create high contrast mode
- [ ] Ensure WCAG AA compliance
- [ ] Add focus visible indicators
- [ ] Implement reduced motion mode
- [ ] Create text-only fallback view
- [ ] Add alt text for all images
- [ ] Implement language support
- [ ] Add RTL layout support
- [ ] Test with screen readers

### Phase 9: Sharing & Persistence (Milestone 21)

#### Milestone 21 — State Management & Sharing
- [ ] Create URL state serialization
- [ ] Encode focus, zoom, layout in URL
- [ ] Implement URL shortener service
- [ ] Create share button with options
- [ ] Generate social media preview cards
- [ ] Add copy link functionality
- [ ] Implement bookmark system
- [ ] Save custom views
- [ ] Create workspace persistence
- [ ] Add export to PNG/SVG
- [ ] Implement print stylesheet
- [ ] Create embeddable widget version
- [ ] Add API for external integration
- [ ] Generate citation formats

### Phase 10: Quality & Deployment (Milestone 22)

#### Milestone 22 — Testing & Deployment
- [ ] Set up Vitest configuration
- [ ] Write unit tests for utilities
- [ ] Test layout algorithms
- [ ] Test search functionality
- [ ] Create component tests with React Testing Library
- [ ] Set up Playwright for E2E tests
- [ ] Test critical user journeys
- [ ] Add visual regression tests
- [ ] Create performance benchmarks
- [ ] Set up GitHub Actions CI/CD
- [ ] Add pre-commit hooks
- [ ] Configure Vercel deployment
- [ ] Set up environment variables
- [ ] Add error tracking (Sentry)
- [ ] Implement analytics (privacy-friendly)
- [ ] Create deployment checklist
- [ ] Write user documentation
- [ ] Create video tutorials

## ✅ Acceptance Criteria
- 50k+ nodes smooth on desktop and usable on modern mobile
- Hover highlight under 16ms, click-to-focus stable frame under 300ms
- Search results under 100ms for 50k taxa
- LLM first token under 3s with grounded context
- WCAG AA color contrast and keyboard operability
- Theming persists and share links restore state

## 🚧 Future Extensions

- Time slider for evolutionary timelines
- Phylogenetic uncertainty visualization
- User annotations and saved views
- Export to PNG/SVG and share cards
- Collaborative exploration sessions
- AR/VR support for immersive exploration
- Integration with genomic databases
- Custom tree uploads and comparisons

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open Tree of Life](https://tree.opentreeoflife.org/) for providing the synthetic tree data
- [p5.js](https://p5js.org/) community for the powerful creative coding library
- [Next.js](https://nextjs.org/) team for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components

## 📮 Contact

Project Link: [https://github.com/alpha-adam/tol](https://github.com/alpha-adam/tol)

---

<p align="center">Made with ❤️ for exploring the wonders of life</p>
