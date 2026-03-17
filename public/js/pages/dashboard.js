/**
 * Dashboard Page - Mission Control Home
 * Priority-driven with clear urgency indicators
 * Updated: 2026-03-15 (Day 4)
 */
class DashboardPage {
  constructor() {
    this.data = null;
    this.refreshInterval = null;
  }

  async render(container, params = []) {
    try {
      this.data = await api.getState();

      container.innerHTML = `
        <div class="grid grid-4">

          <!-- SOL STATUS BANNER -->
          <div class="card col-span-4" style="border: 2px solid #22c55e; background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02));">
            <div class="card-header">
              <span class="card-title" style="color: #22c55e; font-size: 1.1rem;">☀️ SOL FINN — STATUS</span>
              <span class="badge badge-green" id="sol-status-badge">ONLINE</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 8px 0;">
              <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 4px;">Current Activity</div>
                <div style="font-size: 0.9rem; color: #fff;">🚀 Day 4: GSC live, Instantly warming, 25 outreach emails ready, FertilityFinder upgraded, 6 blog posts deployed</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 4px;">Last Action</div>
                <div style="font-size: 0.9rem; color: #d1d5db;">FertilityFinder deployed with Google Maps data, outreach emails v2 written</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 4px;">System Health</div>
                <div style="font-size: 0.9rem; color: #22c55e;">🟢 All good</div>
              </div>
            </div>
            <div style="font-size: 0.7rem; color: #6b7280; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px; margin-top: 8px;">
              ⚠️ Known limitations: Instantly warmup in progress (ready ~Mar 29). Domains fertilityfinding.com + rusttoglory.com not purchased yet.
            </div>
          </div>

          <!-- SPENDING TRACKER -->
          <div class="card col-span-4" style="border: 2px solid #8b5cf6; background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02));">
            <div class="card-header">
              <span class="card-title" style="color: #8b5cf6; font-size: 1.1rem;">💳 SPENDING TRACKER — API & Infrastructure Costs</span>
              <span class="badge" style="background: #8b5cf6;">RULE: No surprise costs</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 8px 0;">
              <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px;">
                <div style="font-size: 0.7rem; color: #6b7280;">Google Cloud</div>
                <div style="font-size: 1.2rem; color: #fff; font-weight: 700;">~$14</div>
                <div style="font-size: 0.65rem; color: #8b5cf6;">of $200/mo free credit</div>
                <div style="font-size: 0.6rem; color: #6b7280; margin-top: 4px;">Places API (360 LocallySF + 264 SoakPlanet photos/reviews)</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px;">
                <div style="font-size: 0.7rem; color: #6b7280;">Vercel</div>
                <div style="font-size: 1.2rem; color: #22c55e; font-weight: 700;">$0</div>
                <div style="font-size: 0.65rem; color: #22c55e;">Free tier (Hobby)</div>
                <div style="font-size: 0.6rem; color: #6b7280; margin-top: 4px;">8 sites deployed</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px;">
                <div style="font-size: 0.7rem; color: #6b7280;">Domains</div>
                <div style="font-size: 1.2rem; color: #fff; font-weight: 700;">~$24</div>
                <div style="font-size: 0.65rem; color: #6b7280;">soakplanet.com + locallysf.com</div>
                <div style="font-size: 0.6rem; color: #6b7280; margin-top: 4px;">2 more pending (~$24)</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px;">
                <div style="font-size: 0.7rem; color: #6b7280;">Monthly Total</div>
                <div style="font-size: 1.2rem; color: #22c55e; font-weight: 700;">~$0/mo</div>
                <div style="font-size: 0.65rem; color: #22c55e;">All within free tiers</div>
                <div style="font-size: 0.6rem; color: #6b7280; margin-top: 4px;">⚠️ Google free credit expires after 90 days</div>
              </div>
            </div>
            <div style="font-size: 0.7rem; color: #ef4444; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px; margin-top: 8px;">
              🔒 RULE: Sol will NEVER run any action that costs money without telling Henry first with an estimate. No exceptions.
            </div>
          </div>

          <!-- KPI Cards Row -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">💰 Revenue</span>
            </div>
            <div class="big-number" style="color: #ef4444;">$${this.formatRevenue()}</div>
            <div class="big-label">Target: $50,000 by Apr 12</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">⏰ Days Left</span>
            </div>
            <div class="big-number" style="color: #ef4444;">${this.getDaysToDeadline()}</div>
            <div class="big-label">Until $50K deadline</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">📊 Projects</span>
            </div>
            <div class="big-number">${this.getActiveProjectsCount()}</div>
            <div class="big-label">${this.getCriticalCount()} critical priority</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">🔥 Day</span>
            </div>
            <div class="big-number">${this.getDaysSinceStart()}</div>
            <div class="big-label">Since launch (Mar 12)</div>
          </div>

          <!-- HENRY'S ACTION ITEMS — Things only Henry can do -->
          <div class="card col-span-4" style="border: 2px solid #f59e0b; background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02));">
            <div class="card-header">
              <span class="card-title" style="color: #f59e0b; font-size: 1.1rem;">👑 HENRY'S ACTION ITEMS — Only You Can Do These</span>
              <span class="badge badge-amber">${this.getHenryActionItems().length} items</span>
            </div>
            ${this.renderHenryActionItems()}
          </div>

          <!-- URGENT: Revenue Actions -->
          <div class="card col-span-4" style="border: 2px solid #ef4444; background: linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02));">
            <div class="card-header">
              <span class="card-title" style="color: #ef4444; font-size: 1.1rem;">🚨 REVENUE ACTIONS — DO THESE TODAY</span>
              <span class="badge badge-red">$0 → $10K</span>
            </div>
            ${this.renderUrgentActions()}
          </div>

          <!-- Revenue Targets -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">🎯 Revenue Targets</span>
              <span class="badge badge-red">Day ${this.getDaysSinceStart()}</span>
            </div>
            ${this.renderTargets()}
          </div>

          <!-- Priority Projects (sorted by urgency) -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">🏢 Projects by Priority</span>
            </div>
            <div id="priority-projects">
              ${this.renderPriorityProjects()}
            </div>
          </div>

          <!-- Blockers & Alerts -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">🚧 Blockers & Next Steps</span>
            </div>
            <div id="blockers">
              ${this.renderBlockers()}
            </div>
          </div>

          <!-- Deployed Products -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">🌐 Live Products</span>
              <span class="badge badge-green">${this.getLiveCount()} deployed</span>
            </div>
            <div id="live-products">
              ${this.renderLiveProducts()}
            </div>
          </div>

          <!-- Today's Wins -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">✅ Recent Wins (Day 3-4)</span>
              <span class="badge badge-cyan">Mar 14-15</span>
            </div>
            <div id="recent-wins">
              ${this.renderRecentWins()}
            </div>
          </div>

          <!-- Tools & Access Status -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">🔧 Sol's Tools & Access Status</span>
            </div>
            ${this.renderToolsStatus()}
          </div>
        </div>
      `;

      this.setupEventListeners();

    } catch (error) {
      console.error('Failed to render dashboard:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Dashboard Error</h2>
          <p>Failed to load dashboard data: ${error.message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  formatRevenue() {
    if (this.data?.tradingState?.totalPnL) {
      return Math.max(0, this.data.tradingState.totalPnL).toLocaleString();
    }
    return '0';
  }

  getDaysToDeadline() {
    const deadline = new Date('2026-04-12');
    const today = new Date();
    const diffTime = deadline - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysSinceStart() {
    const startDate = new Date('2026-03-12');
    const today = new Date();
    return Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  }

  getActiveProjectsCount() {
    return this.data?.projects ? Object.keys(this.data.projects).length : 0;
  }

  getCriticalCount() {
    return this.getPriorityProjectList().filter(p => p.priority === 'Critical').length;
  }

  getLiveCount() {
    return this.getLiveProductList().length;
  }

  getHenryActionItems() {
    return [
      { id: 1, action: '✅ Enter SSN on Gumroad', detail: 'DONE — payouts unblocked!', time: '2 min', impact: 'Playbook sales LIVE', status: 'done' },
      { id: 2, action: '✅ Set up Google Search Console', detail: 'DONE — soakplanet.com + locallysf.com indexed', time: '15 min', impact: 'SEO clock started on 14,000+ pages', status: 'done' },
      { id: 3, action: '🔗 Point fertilityfinding.com + rusttoglory.com DNS', detail: 'A: @ → 76.76.21.21 | CNAME: www → cname.vercel-dns.com', time: '10 min', impact: 'Sites go live on custom domains', status: 'todo' },
      { id: 4, action: '🔗 Point executiveintelligence.ai DNS → Vercel', detail: 'GoDaddy DNS → A: @ → 76.76.21.21 | CNAME: www → cname.vercel-dns.com', time: '5 min', impact: 'Professional URL for client outreach', status: 'todo' },
      { id: 5, action: '📋 Review LocallySF Business Plan', detail: 'Sol Finn SOPs/Guides/ on Drive', time: '20 min', impact: 'Starts outreach pipeline', status: 'todo' },
      { id: 6, action: '📧 Review & approve outreach email templates', detail: 'before first send', time: '15 min', impact: 'Enables LocallySF outreach', status: 'todo' },
      { id: 7, action: '✅ Toggle Instantly.ai warmup ON', detail: 'DONE — warming up, ready ~March 29', time: '1 min', impact: 'Outreach ready in 2 weeks', status: 'done' },
      { id: 8, action: '🐦 Complete X auth', detail: 'run `xurl auth oauth2 --app solfinn` in terminal', time: '5 min', impact: 'X/Twitter access for Sol', status: 'todo' },
      { id: 9, action: '💰 Sign up for affiliate programs', detail: 'Booking.com, Amazon, Hagerty', time: '30 min', impact: 'Passive revenue on all directories', status: 'todo' },
      { id: 10, action: '📈 Fund Kalshi account ($200-500)', detail: '+ generate API keys', time: '15 min', impact: 'Trading desk goes live', status: 'todo' },
      { id: 11, action: '🔑 Provide Supabase + Anthropic env vars', detail: 'for Good Bunny deploy', time: '10 min', impact: 'VitaLog app goes live', status: 'todo' },
      { id: 12, action: '📊 Set up Google Search Console', detail: 'for fertilityfinding.com, rusttoglory.com (after DNS)', time: '10 min', impact: 'SEO tracking for all directories', status: 'todo' },
      { id: 13, action: '📱 Create LocallySF social accounts', detail: 'Instagram, X/Twitter', time: '20 min', impact: 'Social media presence', status: 'todo' },
      { id: 14, action: '💼 Post LinkedIn #1', detail: 'relaunch announcement', time: '2 min', impact: 'Lead generation starts', status: 'todo' },
    ];
  }

  renderHenryActionItems() {
    const items = this.getHenryActionItems();
    return items.map(item => `
      <div class="list-item" style="padding: 10px 16px; margin-bottom: 6px; background: rgba(245,158,11,0.04); border-radius: 8px; border-left: 4px solid ${item.status === 'done' ? '#22c55e' : '#f59e0b'};">
        <div style="display: flex; align-items: flex-start; gap: 12px; width: 100%;">
          <div style="min-width: 28px; height: 28px; border-radius: 50%; background: ${item.status === 'done' ? '#22c55e' : '#f59e0b'}; color: ${item.status === 'done' ? '#fff' : '#000'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">${item.status === 'done' ? '✓' : item.id}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #fff; margin-bottom: 3px; font-size: 0.9rem;">${item.action}</div>
            <div style="font-size: 0.78rem; color: #9ca3af; margin-bottom: 3px;">${item.detail}</div>
            <div style="display: flex; gap: 12px; font-size: 0.72rem;">
              <span style="color: #60a5fa;">⏱ ${item.time}</span>
              <span style="color: #34d399;">🔓 ${item.impact}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderUrgentActions() {
    const actions = [
      { 
        priority: '1', 
        action: 'Enter SSN on Gumroad → unblocks $197 playbook sales', 
        detail: 'gumroad.com/settings/payments → enter SSN → unpause payouts. No revenue received without this!',
        time: '2 min',
        revenue: 'UNBLOCKS $197 PLAYBOOK SALES',
        status: 'ready'
      },
      { 
        priority: '2', 
        action: 'Set up Google Search Console → starts SEO clock on 13,000+ pages', 
        detail: 'Google Search Console for soakplanet.com, locallysf.com → verify domains',
        time: '15 min',
        revenue: 'Starts SEO clock for massive organic traffic',
        status: 'ready'
      },
      { 
        priority: '3', 
        action: 'Toggle Instantly.ai warmup → 2 weeks to outreach readiness', 
        detail: 'Instantly → Email Accounts → sol@ → toggle Warmup ON (2 weeks needed)',
        time: '1 min',
        revenue: 'Enables LocallySF outreach pipeline',
        status: 'ready'
      },
      { 
        priority: '4', 
        action: 'Review LocallySF Business Plan → starts outreach pipeline', 
        detail: 'Sol Finn SOPs/Guides/ on Drive → approve outreach templates',
        time: '20 min',
        revenue: 'B2B outreach for LocallySF',
        status: 'ready'
      },
      { 
        priority: '5', 
        action: 'Sign up for affiliate programs → passive revenue on all directories', 
        detail: 'Booking.com Partners (4-8%) + Amazon Associates + Hagerty Insurance (5-15%)',
        time: '30 min',
        revenue: 'Monetize directory traffic immediately',
        status: 'ready'
      },
    ];

    return actions.map(a => `
      <div class="list-item" style="padding: 12px 16px; margin-bottom: 8px; background: rgba(239,68,68,0.04); border-radius: 8px; border-left: 4px solid #ef4444;">
        <div style="display: flex; align-items: flex-start; gap: 12px; width: 100%;">
          <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #ef4444; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">${a.priority}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${a.action}</div>
            <div style="font-size: 0.8rem; color: #9ca3af; margin-bottom: 4px;">${a.detail}</div>
            <div style="display: flex; gap: 12px; font-size: 0.75rem;">
              <span style="color: #60a5fa;">⏱ ${a.time}</span>
              <span style="color: #34d399;">💰 ${a.revenue}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderTargets() {
    const targets = [
      { label: 'Urgent Fund ($50K by Apr 12)', current: 0, target: 50000, type: 'red' },
      { label: 'Monthly Recurring ($35K/mo)', current: 0, target: 35000, type: 'amber' },
      { label: 'Debt Clearance ($200K by EOY)', current: 0, target: 200000, type: 'blue' }
    ];

    return targets.map(target => {
      const percentage = Math.round((target.current / target.target) * 100);
      return `
        <div class="progress">
          <div class="progress-header">
            <span class="progress-label">${target.label}</span>
            <span class="progress-value">$${target.current.toLocaleString()} / $${target.target.toLocaleString()}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill fill-${target.type}" style="width: ${Math.max(percentage, 1)}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  getPriorityProjectList() {
    return [
      // === REVENUE-CRITICAL ===
      { name: 'Directory Empire', icon: '🏛️', priority: 'Critical', status: '🟢 4 SITES LIVE — SoakPlanet (292), FertilityFinder (80+), ClassicWrench (80+), LocallySF (12,966)', health: '🟢', revenue: '$30-60K/yr (SEO)', statusColor: 'green' },
      { name: 'LocallySF', icon: '🌉', priority: 'Critical', status: '🟢 LIVE — 12,966 places, 12 categories, business plan + outreach strategy ready', health: '🟢', revenue: '$20K/mo by Month 12', statusColor: 'green' },
      { name: 'Website Factory', icon: '🏭', priority: 'Critical', status: '🟢 Live — $495/site, Stripe live, 94.5% margin', health: '🟢', revenue: '$468 profit/sale', statusColor: 'green' },
      { name: 'Executive Intelligence', icon: '🧠', priority: 'Critical', status: '🟡 Needs DNS — Site + playbook ($197 on Gumroad) built, domain not pointed', health: '🟡', revenue: '$10K/client sprint', statusColor: 'amber' },

      // === HIGH PRIORITY ===
      { name: 'ONI SWARM', icon: '⛩️', priority: 'High', status: '🟡 Henry Working — Fundraise deck, $100K target', health: '🟡', revenue: '$100K raise', statusColor: 'amber' },
      { name: 'ONI Force (0N1 Corp)', icon: '👹', priority: 'High', status: '🟡 Ongoing — Henry is CEO, anime IP, NFT project', health: '🟡', revenue: 'IP licensing + community', statusColor: 'amber' },
      { name: 'Trading Operations', icon: '📈', priority: 'High', status: '🔴 Blocked — Kalshi approved, needs funding + API keys', health: '🔴', revenue: 'Trading P&L', statusColor: 'red' },
      { name: 'Prediction Market Arbitrage', icon: '🎰', priority: 'High', status: '🟡 Scanner built — Polymarket/Kalshi arb detection, needs live testing', health: '🟡', revenue: 'Arbitrage spreads', statusColor: 'amber' },
      { name: 'AI Video Empire', icon: '🎬', priority: 'High', status: '🟡 Landing page live — $497 course + Whop community planned', health: '🟡', revenue: '$497 course + $97/mo community', statusColor: 'amber' },
      { name: 'Content Funnel Engine', icon: '📣', priority: 'High', status: '🟡 Planned — Multi-platform content distribution for lead gen', health: '🟡', revenue: 'Leads for all products', statusColor: 'amber' },
      { name: 'LinkedIn Reactivation', icon: '💼', priority: 'High', status: '🟡 Posts drafted — Profile rewrite done, Post #1 ready, waiting for Henry to post', health: '🟡', revenue: 'EI client leads', statusColor: 'amber' },

      // === MEDIUM PRIORITY ===
      { name: 'Digital Products', icon: '📦', priority: 'Medium', status: '🟢 3 Live — AI Dashboard, 100 AI Prompts, Website Roaster', health: '🟢', revenue: '$19-197/sale', statusColor: 'green' },
      { name: 'Good Bunny (VitaLog App)', icon: '💚', priority: 'Medium', status: '🔴 Blocked — Needs Supabase + Anthropic env vars', health: '🔴', revenue: 'SaaS subscription', statusColor: 'red' },
      { name: 'VitaLog Funnel', icon: '💜', priority: 'Medium', status: '🟢 Live — Waitlist/landing page at vitalog-mauve.vercel.app', health: '🟢', revenue: 'Waitlist capture', statusColor: 'green' },
      { name: 'Game of Life Questionnaire', icon: '🎮', priority: 'Medium', status: '🟡 v1 done — 192 questions, 12 domains, AI persona construction tool', health: '🟡', revenue: '$50-500 assessment product', statusColor: 'amber' },
      { name: 'GK Labs', icon: '🔬', priority: 'Medium', status: '🟡 Umbrella brand — Stealth AI R&D lab, houses all AI products', health: '🟡', revenue: 'Parent entity', statusColor: 'amber' },
      { name: 'Client: Early Life Psych', icon: '🧩', priority: 'Medium', status: '⏳ Awaiting feedback — 2 designs delivered', health: '🟡', revenue: '$5-15K', statusColor: 'cyan' },
      { name: 'Client: Simplicity Media', icon: '📱', priority: 'Medium', status: '⏳ Awaiting feedback — 3 designs delivered', health: '🟡', revenue: '$3-5K', statusColor: 'cyan' },

      // === LOWER PRIORITY / PAUSED ===
      { name: 'Fat Henry\'s Burger Paradise', icon: '🍔', priority: 'Low', status: '🟢 Built — Fun/hobby site, single HTML page', health: '🟢', revenue: 'N/A (fun)', statusColor: 'green' },
      { name: 'AI Arbitrage Empire', icon: '🤖', priority: 'Low', status: '🟡 Business plan written — Full automation playbook ready', health: '🟡', revenue: 'Multiple streams', statusColor: 'amber' },
      { name: 'IKPALI', icon: '🪑', priority: 'Low', status: '⏸️ Paused — Furniture design project (mentioned, not active)', health: '⚪', revenue: 'TBD', statusColor: 'cyan' },
    ];
  }

  renderPriorityProjects() {
    const projects = this.getPriorityProjectList();
    const priorityColors = { 'Critical': '#ef4444', 'High': '#f59e0b', 'Medium': '#3b82f6', 'Low': '#6b7280' };

    return projects.map(p => `
      <div class="list-item" style="padding: 10px 12px; margin-bottom: 6px; border-left: 3px solid ${priorityColors[p.priority]}; border-radius: 4px; background: rgba(255,255,255,0.02);">
        <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
          <span style="font-size: 1.1rem;">${p.icon}</span>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; color: #fff; font-size: 0.85rem;">${p.name}</div>
            <div style="font-size: 0.75rem; color: #9ca3af;">${p.status}</div>
          </div>
          <div style="text-align: right; flex-shrink: 0;">
            <span class="badge badge-${p.statusColor}" style="font-size: 0.65rem; padding: 2px 8px;">${p.priority}</span>
            <div style="font-size: 0.65rem; color: #6b7280; margin-top: 2px;">${p.health}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderBlockers() {
    const blockers = [
      { icon: '✅', message: 'Gumroad SSN — DONE, payouts unblocked', tag: 'DONE', tagColor: 'green' },
      { icon: '✅', message: 'Instantly.ai warmup — ON, ready ~March 29', tag: 'DONE', tagColor: 'green' },
      { icon: '🟡', message: 'Domain DNS — fertilityfinding.com, rusttoglory.com, executiveintelligence.ai not pointed', tag: 'Henry', tagColor: 'amber' },
      { icon: '🟡', message: 'Google Search Console — not set up for any site', tag: 'Henry', tagColor: 'amber' },
      { icon: '🟡', message: 'Trading — Kalshi unfunded, no API keys', tag: 'Blocked', tagColor: 'amber' },
    ];

    return blockers.map(b => `
      <div class="list-item" style="padding: 8px 12px; margin-bottom: 4px;">
        <span style="margin-right: 8px;">${b.icon}</span>
        <div style="flex: 1; font-size: 0.82rem; color: #d1d5db;">${b.message}</div>
        <span class="badge badge-${b.tagColor}" style="font-size: 0.6rem; padding: 2px 6px; flex-shrink: 0;">${b.tag}</span>
      </div>
    `).join('');
  }

  getLiveProductList() {
    return [
      { name: '🌍 SoakPlanet', url: 'https://soakplanet.com', status: '292 springs, Google photos + reviews, 6 blog posts' },
      { name: '🌉 LocallySF', url: 'https://locallysf.com', status: '12,966 places, 12 categories, real Google data' },
      { name: '🏥 FertilityFinder', url: 'https://fertility-clinics.vercel.app', status: '80+ clinics, 10 blog posts' },
      { name: '🔧 ClassicWrench', url: 'https://classic-mechanics.vercel.app', status: '80+ shops, 16 blog posts' },
      { name: '🔥 Website Factory', url: 'https://website-roaster.vercel.app', status: '$495 checkout, Stripe live' },
      { name: '🧠 Executive Intelligence', url: 'https://executiveintelligence.ai', status: 'Site live (DNS pending)' },
      { name: '🎬 AI Video Empire', url: 'https://ai-video-empire.vercel.app', status: 'Landing page live' },
      { name: '📊 AI Business Dashboard', url: 'https://deploy-dashboard-theta.vercel.app', status: 'Digital product live' },
      { name: '📝 100 AI Prompts', url: 'https://deploy-prompts.vercel.app', status: 'Digital product live' },
      { name: '💚 VitaLog Funnel', url: 'https://vitalog-mauve.vercel.app', status: 'Waitlist page' },
      { name: '🍔 Fat Henry\'s', url: 'https://fat-henrys.vercel.app', status: 'Fun/hobby site' },
      { name: '🧩 Early Life Psych', url: 'https://early-life-psych-v2.vercel.app', status: '(client)' },
      { name: '📱 Simplicity Media', url: 'https://simplicity-funnel-v3.vercel.app', status: '(client)' },
    ];
  }

  renderLiveProducts() {
    return this.getLiveProductList().map(p => `
      <div class="list-item" style="padding: 8px 12px; margin-bottom: 4px;">
        <span style="color: #22c55e; margin-right: 8px;">●</span>
        <div style="flex: 1;">
          <a href="${p.url}" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 0.85rem; font-weight: 500;">${p.name}</a>
          <div style="font-size: 0.7rem; color: #6b7280;">${p.status}</div>
        </div>
      </div>
    `).join('');
  }

  renderRecentWins() {
    const wins = [
      { icon: '🌉', text: 'LocallySF: 328 → 12,966 places (39x expansion via OSM + DataSF)', time: 'Day 4' },
      { icon: '📋', text: 'LocallySF Business Plan written with full outreach strategy', time: 'Day 4' },
      { icon: '🌍', text: 'SoakPlanet major redesign (Triplio-style, Google reviews)', time: 'Day 4' },
      { icon: '✍️', text: '32 SEO blog posts across 3 directories', time: 'Day 3-4' },
      { icon: '🤖', text: 'AI SEO implemented on all directories', time: 'Day 3-4' },
      { icon: '📷', text: 'Google Maps photos on SoakPlanet (1,250+ real photos)', time: 'Day 3-4' },
      { icon: '📝', text: 'Brand naming guide (10,290 words)', time: 'Day 3-4' },
      { icon: '🌐', text: 'soakplanet.com + locallysf.com live on custom domains', time: 'Day 3-4' },
      { icon: '🔧', text: '6 new tools connected (email, Stripe, Google Calendar, etc.)', time: 'Day 3-4' },
    ];

    return wins.map(w => `
      <div class="list-item" style="padding: 6px 12px; margin-bottom: 2px;">
        <span style="margin-right: 8px;">${w.icon}</span>
        <div style="flex: 1; font-size: 0.8rem; color: #d1d5db;">${w.text}</div>
        <span style="font-size: 0.65rem; color: #6b7280; flex-shrink: 0;">${w.time}</span>
      </div>
    `).join('');
  }

  renderToolsStatus() {
    const tools = [
      { name: 'Himalaya (email)', status: '✅ Active', detail: 'sol@executiveintelligence.ai' },
      { name: 'Stripe', status: '✅ Active', detail: '$495 checkout live' },
      { name: 'Google Calendar', status: '✅ Active', detail: 'gcalcli connected' },
      { name: 'Google Drive', status: '✅ Active', detail: 'rclone connected' },
      { name: 'Google Places API', status: '✅ Active', detail: 'photo/review data' },
      { name: 'PageSpeed API', status: '✅ Active', detail: 'Website Roaster' },
      { name: 'Instantly.ai', status: '⚠️ Connected', detail: 'warmup OFF' },
      { name: 'Gumroad', status: '⚠️ SSN needed', detail: 'for payouts' },
      { name: 'X/Twitter (xurl)', status: '⚠️ OAuth not', detail: 'completed' },
      { name: 'Beehiiv', status: '✅ Connected', detail: 'to SoakPlanet' },
      { name: 'Brave Search', status: '❌ Not configured', detail: 'Need API key' },
      { name: 'Kalshi', status: '❌ Not funded', detail: 'Need deposit + API' },
      { name: 'Supabase', status: '❌ Not configured', detail: 'Need env vars' },
    ];

    return `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px;">
      ${tools.map(t => `
        <div style="padding: 8px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 0.85rem;">${t.status.split(' ')[0]}</span>
          <div style="flex: 1;">
            <div style="font-size: 0.82rem; color: #fff; font-weight: 500;">${t.name}</div>
            <div style="font-size: 0.68rem; color: #6b7280;">${t.detail}</div>
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  setupEventListeners() {
    // Future: click handlers for action items
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }

  destroy() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['dashboard'] = DashboardPage;
