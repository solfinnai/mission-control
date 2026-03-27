# Sol Finn Mission Control — Full Application Spec

## Overview
A localhost web application that serves as the operating system for Henry Finn's business empire. Built with Node.js/Express backend and a single-page application frontend with client-side routing. Dark premium aesthetic matching the Executive Intelligence brand guide.

## Tech Stack
- **Backend:** Node.js + Express
- **Frontend:** Vanilla JS SPA (no framework — keep it simple and fast)
- **Styling:** CSS with the design system below
- **Data:** Reads markdown and JSON files from the workspace directory (parent of this app's directory)
- **Port:** 3333

## Architecture

### File Structure
```
mission-control/
├── server.js              # Express server + API routes
├── package.json
└── public/
    ├── index.html          # SPA shell (sidebar + content area)
    ├── css/
    │   └── styles.css      # All styles
    ├── js/
    │   ├── app.js           # Router + app shell logic
    │   ├── api.js           # API client
    │   └── pages/
    │       ├── dashboard.js  # Home dashboard
    │       ├── office.js     # Sims-style office view
    │       ├── projects.js   # Project pages
    │       ├── finances.js   # Financial tracking
    │       ├── trading.js    # Trading operations
    │       ├── content.js    # Content calendar
    │       ├── tasks.js      # Task management
    │       ├── memory.js     # Knowledge graph browser
    │       ├── docs.js       # File browser
    │       ├── team.js       # Agent roster
    │       ├── comms.js      # Communications
    │       ├── calendar.js   # Calendar view
    │       └── settings.js   # Settings
    └── assets/              # Any static assets
```

### API Routes (server.js)

The server reads from the workspace directory (`path.join(__dirname, '..')`).

```
GET /api/state              → Full dashboard state (mission control, finances, trading, projects)
GET /api/file/:path         → Read any workspace file, return {content, html}
GET /api/files              → List all workspace files recursively
GET /api/files/:dir         → List files in a specific directory
GET /api/projects           → List all projects with their files
GET /api/trading            → Trading state (TRADING-STATE.json + TRADING.md + TRADING-LOG.md)
GET /api/memory             → List all memory files
GET /api/memory/:date       → Get specific daily note
GET /api/life               → Knowledge graph index + all entity summaries
```

Use the `marked` library to convert markdown to HTML for display.

## Design System

### Colors (CSS Variables)
```css
--bg: #0a0a1a;
--surface: #12122a;
--surface-2: #1a1a3a;
--card: rgba(255,255,255,0.05);
--border: rgba(255,255,255,0.08);
--border-hover: rgba(255,255,255,0.15);
--primary: #6366f1;
--primary-light: #818cf8;
--green: #34d399;
--red: #f87171;
--amber: #fbbf24;
--cyan: #22d3ee;
--text: #f8fafc;
--muted: #94a3b8;
--dim: #64748b;
```

### Typography
- Font: Inter (Google Fonts)
- Headings: weight 700-900, tight tracking (-0.02em)
- Body: weight 400, 0.9rem
- Labels: weight 700, 0.7rem, uppercase, letter-spacing 0.12em
- Monospace: 'JetBrains Mono' or system monospace for code/data

### Components
- **Cards:** `background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px;`
- **Badges:** Pill-shaped, colored backgrounds at 15% opacity
- **Buttons:** Primary (indigo fill), Secondary (glass), Danger (red)
- **Progress bars:** 8px height, rounded, gradient fills
- **Tables:** Minimal, row borders only, alternating subtle backgrounds
- **Inputs:** Dark background, border on focus turns primary

### Layout
- Sidebar: 260px fixed width, full height, scrollable
- Content area: Fills remaining width, scrollable, max-width 1400px centered
- Header bar: Sticky top within content area, shows current page title + clock

## Sidebar Navigation

Fixed left sidebar with:
- Logo/brand at top: "☀️ Sol Finn" + "Mission Control" subtitle
- Online status indicator (green dot + "ONLINE")
- Navigation items (icon + label), grouped:

**Group: Operations**
- 🏠 Dashboard
- 🏢 Office
- 📋 Tasks

**Group: Business**
- 📊 Projects (expandable → sub-items for each project)
- 💰 Finances
- 📈 Trading

**Group: Growth**
- ✍️ Content
- 📧 Comms

**Group: Knowledge**
- 🧠 Memory
- 📁 Docs
- 📅 Calendar

**Group: System**
- 👥 Team
- ⚙️ Settings

Active page gets highlighted background + left border accent.
Hovering shows subtle background change.

At the bottom of sidebar:
- Small clock showing current time
- "Day 1" counter (days since 2026-03-12)

## Pages

### 1. 🏠 Dashboard (Home)

The command center overview. Everything at a glance.

**Top row — 4 KPI cards:**
- Revenue This Month: big number + target
- Days to Deadline: countdown to Apr 12 ($50K target)
- Active Projects: count
- Agent Status: "3 online" with dots

**Row 2 — Revenue Targets (full width):**
- 3 progress bars: Urgent Fund, Monthly Recurring, Debt Clearance
- Each with label, current/target, percentage

**Row 3 — 2 columns:**
Left: **Today's Plan** (checklist from daily notes, interactive checkboxes)
Right: **Recent Activity** (timeline of recent daily note entries, most recent first)

**Row 4 — 2 columns:**
Left: **Quick Projects** (cards for each active project with status badge)
Right: **Alerts** (any blocked items, upcoming deadlines, system issues)

### 2. 🏢 Office

The Sims-style isometric office view.

**Top section:** Full-width isometric office with rooms for:
- Henry (CEO Office) — golden accent, Sims plumbob
- Sol (Command Center) — indigo accent, particles
- Sonnet (Writer's Desk) — cyan accent
- Codex (Build Lab) — green accent
- Trading Floor
- Executive Intelligence
- Content Studio
- GK Labs
- 0N1 Force

Each room shows:
- Character emoji with name
- Status indicator (active/idle/working)
- Current task in a small speech bubble (if active)
- Click to navigate to that project/agent's page

**Bottom section:** Live Activity Feed
- Real-time log of agent actions (pulled from daily notes)
- Shows which agent did what, when
- Color-coded by agent

### 3. 📋 Tasks

Kanban-style or list view of all tasks.

**Columns:** Backlog | In Progress | Done | Blocked

**Each task card:**
- Title
- Assigned to (Henry/Sol/Sonnet/Codex)
- Project tag
- Priority (🔴 urgent, 🟡 medium, 🟢 low)
- Due date if applicable

**Source:** Parse tasks from daily notes, MISSION-CONTROL.md, and project files.
**Note:** For v1, these are read-only (parsed from files). Edit-in-place comes later.

### 4. 📊 Projects

Main view: Grid of project cards. Click into any for detail page.

**Project Card:**
- Icon + Name
- Status badge
- 1-line description
- Last updated

**Detail Page (per project):**
- Full markdown content rendered
- Sub-files listed (if project is a directory)
- Related tasks
- Timeline of mentions in daily notes

**Projects to show:**
- Executive Intelligence (from PROJECTS/executive-intelligence/)
- GK Labs (from PROJECTS/gk-labs/)
- 0N1 Force (from PROJECTS/oni-force/)
- Kalshi Trading Bot (from PROJECTS/achilles-kalshi-bot.md)
- Content Funnel Engine (from PROJECTS/content-funnel-engine.md)
- App Portfolio (from PROJECTS/app-portfolio.md)
- LinkedIn Reactivation (from PROJECTS/linkedin-reactivation.md)
- Prediction Markets (from PROJECTS/prediction-markets.md)

### 5. 💰 Finances

**Top: Revenue Dashboard**
- Big number: Total Revenue (MTD)
- Progress bars for all targets (from FINANCES.md)
- Revenue by source breakdown

**Middle: Financial Targets Table**
- Parse from FINANCES.md and MISSION-CONTROL.md
- Target, Current, Gap, Deadline, Status

**Bottom: Trading P&L**
- Summary from TRADING-STATE.json
- Link to full Trading page

### 6. 📈 Trading

**Control Panel:**
- Kill Switch toggle (visual, read-only for now)
- Autonomy Level indicator (1-5 scale)
- Current bankroll
- Today's P&L

**Positions Table:**
- Open positions from TRADING-STATE.json
- Platform, market, direction, entry, current, P&L

**Trade Log:**
- Parsed from TRADING-LOG.md
- Filterable by platform, date, outcome

**Risk Parameters:**
- Parsed from TRADING.md
- Max position size, daily loss limit, etc.

### 7. ✍️ Content

**Content Calendar (week view):**
- Grid: Mon-Sun columns, rows for each platform (LinkedIn, Twitter, TikTok)
- Planned content shown as cards

**Draft Queue:**
- List of draft content waiting to be posted
- Platform, title/preview, status

**Published:**
- Log of what's been posted (parsed from daily notes)

### 8. 📧 Comms

**Email Summary:**
- Recent emails (when himalaya is set up)
- Outreach tracking

**Outreach Pipeline:**
- Cold outreach sent
- Responses received
- Meetings booked
- Converted to client

(Placeholder for now — populate as data becomes available)

### 9. 🧠 Memory

**Search bar** at top — searches across all memory files.

**Timeline view:**
- List of daily note files, most recent first
- Click to expand/view full content

**Knowledge Graph Browser:**
- Tree view of life/ directory
- Click any entity to see its summary.md and items.json

**MEMORY.md Viewer:**
- Rendered view of tacit knowledge file

### 10. 📁 Docs

Full workspace file browser.

**Left panel:** Directory tree (expandable folders)
**Right panel:** File content viewer (markdown rendered, JSON syntax highlighted)

Exclude: node_modules, .git, mission-control itself

### 11. 📅 Calendar

**Week view** showing:
- Scheduled meetings/calls
- Project deadlines
- Milestones

(Pulls from Google Calendar when integrated, otherwise manual from daily notes)

### 12. 👥 Team

**Agent Roster:**

| Agent | Model | Role | Status | Cost (today) | Tasks Completed |
|-------|-------|------|--------|---------------|-----------------|
| ☀️ Sol | Opus 4 | Brain / Orchestrator | 🟢 Online | — | — |
| ✍️ Sonnet | Sonnet 4 | Writer / Researcher | ⚪ Idle | $0 | 0 |
| ⚡ Codex | GPT-5.2 | Builder / Coder | ⚪ Idle | $0 | 0 |

**Delegation Log:**
- History of tasks delegated to each agent
- Input prompt → Output summary → Review status

**Cost Tracker:**
- Estimated token usage per agent
- Daily/weekly/monthly spend

### 13. ⚙️ Settings

**Connected Services** (status of each integration):
- Telegram, WhatsApp, Gmail, Calendar, Twitter, Kalshi, Vercel, GoDaddy, Gumroad

**Model Configuration:**
- Current model assignments per tier
- Token budget settings

**Workspace:**
- Path display
- File count
- Last backup

## Routing

Use hash-based routing (`#/dashboard`, `#/office`, `#/projects`, etc.)

```javascript
const routes = {
  '/': renderDashboard,
  '/dashboard': renderDashboard,
  '/office': renderOffice,
  '/tasks': renderTasks,
  '/projects': renderProjects,
  '/projects/:id': renderProjectDetail,
  '/finances': renderFinances,
  '/trading': renderTrading,
  '/content': renderContent,
  '/comms': renderComms,
  '/memory': renderMemory,
  '/docs': renderDocs,
  '/calendar': renderCalendar,
  '/team': renderTeam,
  '/settings': renderSettings,
};
```

## Data Refresh
- Dashboard auto-refreshes every 30 seconds
- Trading page refreshes every 10 seconds
- Other pages refresh on navigation
- Manual refresh button in header

## Important Notes for Builder
1. The workspace path is `path.join(__dirname, '..')` — the parent of the mission-control directory
2. All data comes from flat files (markdown + JSON) — no database
3. Keep it performant — don't read every file on every request
4. The marked library is already in package.json for markdown rendering
5. Mobile responsive is nice but desktop-first (this runs on Henry's MacBook)
6. Dark mode ONLY — no light mode
7. The existing server.js has working API routes — extend them, don't break them
8. Port 3333, always
