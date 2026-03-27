class TeamPage {
  constructor() {
    this.name = 'TeamPage';
  }

  async render(container, params = []) {
    container.innerHTML = `
      <div class="page-header">
        <h1>Agent Network</h1>
        <p class="page-desc">27 agents across 5 teams — The Sol Finn Operating System</p>
      </div>

      <!-- Org Overview -->
      <div class="grid-3" style="margin-bottom:24px">
        <div class="card stat-card">
          <div class="stat-value" style="color:var(--primary-light)">27</div>
          <div class="stat-label">Total Agents</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value" style="color:#34d399">5</div>
          <div class="stat-label">Teams</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value" style="color:#fbbf24">~$200</div>
          <div class="stat-label">Est. Monthly Cost</div>
        </div>
      </div>

      <!-- Executive Layer -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #a78bfa;">
        <div class="card-header">
          <span class="card-title">🧠 Executive Layer</span>
          <span class="badge badge-purple">BRAIN</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Model</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>☀️ Sol Finn</strong></td>
              <td><span class="badge badge-purple">Opus 4</span></td>
              <td>COO / Factory Manager — strategy, orchestration, Henry comms, QA</td>
              <td><span class="status-dot green"></span> Online</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Trading Desk -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #34d399;">
        <div class="card-header">
          <span class="card-title">📈 Team 1: Trading Desk</span>
          <span class="badge badge-green">3 Agents</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Model</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>🔍 Scanner</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>24/7 market monitoring — Kalshi, Polymarket, economic data, crypto</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>📊 Analyst</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>Signal validation — edge sizing, news cross-ref, risk framework</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>⚡ Executor</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>Trade placement — API execution, position management, logging</td>
              <td><span class="status-dot dim"></span> Awaiting API Keys</td>
            </tr>
          </tbody>
        </table>
        <div style="padding:12px 16px; font-size:0.8rem; color:var(--muted)">
          Pipeline: Scanner (15min/hourly) → Analyst (validates) → Henry approves → Executor (places trade)
        </div>
      </div>

      <!-- Revenue Operations -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #fbbf24;">
        <div class="card-header">
          <span class="card-title">💰 Team 2: Revenue Operations</span>
          <span class="badge badge-amber">3 Agents</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Model</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>🎯 Prospector</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>Outreach — LinkedIn DMs, cold email, prospect research, pipeline</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>✍️ Content Engine</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>Marketing — LinkedIn posts, Twitter, SEO articles, email drafts</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>🚀 Client Delivery</strong></td>
              <td><span class="badge badge-purple">Opus</span></td>
              <td>Project exec — website builds, design iterations, deploy + QA</td>
              <td><span class="status-dot green"></span> Active (Sol)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dev Factory -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #22d3ee;">
        <div class="card-header">
          <span class="card-title">🏗️ Team 3: Dev Factory</span>
          <span class="badge badge-cyan">5 Agents</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Model</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>🔬 Researcher</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>Idea discovery — HN, Reddit, ProductHunt, trends, market gaps</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>🔨 Builder 1</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>App development — scaffold, build, deploy MVPs</td>
              <td><span class="status-dot green"></span> Active</td>
            </tr>
            <tr>
              <td><strong>🔧 Builder 2</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>Parallel builds — second app stream</td>
              <td><span class="status-dot dim"></span> Queued</td>
            </tr>
            <tr>
              <td><strong>📈 SEO Architect</strong></td>
              <td><span class="badge badge-cyan">Sonnet</span></td>
              <td>Growth — technical SEO, AI SEO, content, structured data</td>
              <td><span class="status-dot green"></span> Active</td>
            </tr>
            <tr>
              <td><strong>🗄️ Data Builder</strong></td>
              <td><span class="badge badge-blue">Haiku</span></td>
              <td>Scraping, enrichment, expansion for directories</td>
              <td><span class="status-dot green"></span> Active</td>
            </tr>
          </tbody>
        </table>
        <div style="padding:12px 16px; font-size:0.8rem; color:var(--muted)">
          Pipeline: Research → Idea Brief → Henry Approves → Builder Ships → Deploy → Track → Kill or Scale
        </div>
      </div>

      <!-- Vibe Marketing -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #ff2d55;">
        <div class="card-header">
          <span class="card-title">🔥 Team 4: Vibe Marketing & Sales</span>
          <span class="badge" style="background:rgba(255,45,85,0.15);color:#ff2d55">16 Agents</span>
        </div>

        <!-- Sub-team A -->
        <div style="padding:12px 16px 4px; font-weight:700; font-size:0.85rem; color:#ff6b9d;">📱 A: Short-Form Video Squad</div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Platform</th><th>Focus</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>🎵 TikTok Specialist</strong></td>
              <td>TikTok</td>
              <td>70%+ completion rate, raw authenticity, problem→fix in 3s</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>📸 Reels Optimizer</strong></td>
              <td>Instagram</td>
              <td>3-second hold rates, carousels (6.6% engagement), DM shares</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>▶️ Shorts Strategist</strong></td>
              <td>YouTube</td>
              <td>Watch-through rate, funnel to long-form, trending audio</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
          </tbody>
        </table>

        <!-- Sub-team B -->
        <div style="padding:16px 16px 4px; font-weight:700; font-size:0.85rem; color:#ff6b9d;">✍️ B: Text & Professional Squad</div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Platform</th><th>Focus</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>💼 LinkedIn Dominator</strong></td>
              <td>LinkedIn</td>
              <td>Carousels, founder-led storytelling, thought leadership</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>🐦 X/Twitter Operator</strong></td>
              <td>X/Twitter</td>
              <td>Threads (3x engagement), velocity in first 30 min, peer networks</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>🕵️ Reddit Infiltrator</strong></td>
              <td>Reddit</td>
              <td>2-4 weeks authentic participation before any promotion</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>🔵 Threads/Bluesky Scout</strong></td>
              <td>Threads + Bluesky</td>
              <td>Low-effort repurposing to fastest-growing platforms</td>
              <td><span class="status-dot dim"></span> Queued</td>
            </tr>
          </tbody>
        </table>

        <!-- Sub-team C -->
        <div style="padding:16px 16px 4px; font-weight:700; font-size:0.85rem; color:#ff6b9d;">🔍 C: SEO & Organic Squad</div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Focus</th><th>Output</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>🏆 SEO Commander</strong></td>
              <td>Programmatic "best X in Y" pages</td>
              <td>20+ pages/week</td>
              <td><span class="status-dot green"></span> Active</td>
            </tr>
            <tr>
              <td><strong>🤖 AI SEO Specialist</strong></td>
              <td>llms.txt, FAQ schema, JSON-LD, AI crawlers</td>
              <td>All products</td>
              <td><span class="status-dot green"></span> Active</td>
            </tr>
            <tr>
              <td><strong>📝 Content Mill</strong></td>
              <td>SEO blog articles, city pages, guide pages</td>
              <td>5-10 articles/week</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
          </tbody>
        </table>

        <!-- Sub-team D -->
        <div style="padding:16px 16px 4px; font-weight:700; font-size:0.85rem; color:#ff6b9d;">🧪 D: Growth Engineering Squad</div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Focus</th><th>Output</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>🧲 Viral Engineer</strong></td>
              <td>Free tools (calculators, quizzes) that capture emails</td>
              <td>1 tool/month</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>🚀 Launch Coordinator</strong></td>
              <td>Product Hunt, waitlist viral loops, launch ops</td>
              <td>Launches</td>
              <td><span class="status-dot dim"></span> Queued</td>
            </tr>
            <tr>
              <td><strong>🏘️ Community Builder</strong></td>
              <td>Discord, Facebook Groups, Reddit, newsletters</td>
              <td>Communities</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
          </tbody>
        </table>

        <!-- Sub-team E -->
        <div style="padding:16px 16px 4px; font-weight:700; font-size:0.85rem; color:#ff6b9d;">💰 E: Sales & Conversion Squad</div>
        <table class="data-table">
          <thead><tr><th>Agent</th><th>Focus</th><th>Output</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>📧 Outreach Machine</strong></td>
              <td>Cold email via Instantly.ai + Smartlead</td>
              <td>100-500/day</td>
              <td><span class="status-dot amber"></span> Building</td>
            </tr>
            <tr>
              <td><strong>💌 Lead Nurture</strong></td>
              <td>Beehiiv email sequences, behavioral triggers</td>
              <td>Sequences</td>
              <td><span class="status-dot dim"></span> Queued</td>
            </tr>
            <tr>
              <td><strong>🤝 Closer Prep</strong></td>
              <td>Prospect research, briefs before sales calls, proposals</td>
              <td>Per call</td>
              <td><span class="status-dot dim"></span> Queued</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Human Team -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #6366f1;">
        <div class="card-header">
          <span class="card-title">👥 Human Team</span>
          <span class="badge badge-blue">Core</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Focus</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Henry Finn</strong></td>
              <td>CEO</td>
              <td><span class="status-dot green"></span> Active</td>
              <td>Strategy, sales, approvals, client relationships</td>
            </tr>
            <tr>
              <td>Brett</td>
              <td>Mentor</td>
              <td><span class="status-dot dim"></span> Advisory</td>
              <td>Strategic guidance, experience, accountability</td>
            </tr>
            <tr>
              <td>VA (TBD)</td>
              <td>Outreach Support</td>
              <td><span class="status-dot dim"></span> Month 3</td>
              <td>$5-10/hr, 20hrs/week — outreach execution</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tool Stack -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <span class="card-title">🧰 Marketing Tool Stack</span>
        </div>
        <div class="grid-3">
          <div style="padding:16px">
            <div style="font-weight:700; color:#34d399; margin-bottom:8px">Budget ($50-80/mo)</div>
            <div style="font-size:0.8rem; color:var(--muted); line-height:1.8">
              Buffer (scheduling)<br>
              Opus Clip (video)<br>
              Beehiiv (newsletter)<br>
              Canva (graphics)<br>
              Google Search Console<br>
              QueueForm (waitlists)<br>
              Discord + MEE6<br>
              n8n (automation)<br>
              Claude API (~$50)
            </div>
          </div>
          <div style="padding:16px">
            <div style="font-weight:700; color:#fbbf24; margin-bottom:8px">Growth ($270/mo)</div>
            <div style="font-size:0.8rem; color:var(--muted); line-height:1.8">
              + Surfer SEO ($99)<br>
              + Instantly.ai ($30)<br>
              + Smartlead ($39)<br>
              + Descript ($24)<br>
              + RevID AI (free)
            </div>
          </div>
          <div style="padding:16px">
            <div style="font-weight:700; color:#ff6b9d; margin-bottom:8px">Scale ($725/mo)</div>
            <div style="font-size:0.8rem; color:var(--muted); line-height:1.8">
              + Clay ($134)<br>
              + HeyGen ($24)<br>
              + MakeUGC ($49)<br>
              + Clearscope ($189)<br>
              + lemlist ($59)
            </div>
          </div>
        </div>
      </div>

      <!-- Virality Framework -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🧬 STEPPS Virality Framework</span>
          <span class="badge" style="background:rgba(255,45,85,0.15);color:#ff2d55">Every Post</span>
        </div>
        <div class="grid-3">
          ${[
            { emoji: '👑', name: 'Social Currency', desc: 'Makes sharer look smart' },
            { emoji: '🔔', name: 'Triggers', desc: 'Linked to daily cues' },
            { emoji: '❤️‍🔥', name: 'Emotion', desc: 'Awe, excitement > sadness' },
            { emoji: '👀', name: 'Public', desc: 'Built to show, built to grow' },
            { emoji: '🎁', name: 'Practical Value', desc: 'Useful = shareable' },
            { emoji: '📖', name: 'Stories', desc: 'Info wrapped in narrative' }
          ].map(s => `
            <div style="padding:16px; text-align:center;">
              <div style="font-size:1.5rem; margin-bottom:4px">${s.emoji}</div>
              <div style="font-weight:700; font-size:0.85rem">${s.name}</div>
              <div style="font-size:0.75rem; color:var(--muted)">${s.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <style>
      .stat-card { text-align: center; padding: 24px; }
      .stat-value { font-size: 2.5rem; font-weight: 800; }
      .stat-label { font-size: 0.85rem; color: var(--muted); margin-top: 4px; }
      .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      @media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } }
      </style>
    `;
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['team'] = TeamPage;
