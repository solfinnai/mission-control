/**
 * Office Page - Isometric HQ with all 5 teams
 */
class OfficePage {
  constructor() {
    this.data = null;
  }

  async render(container, params = []) {
    container.innerHTML = `
      <!-- Isometric Office View -->
      <div class="office-container">
        <div class="office-title">🏢 Sol Finn HQ — 27 Agents, 5 Teams</div>
        
        <!-- Executive Floor -->
        <div class="floor-label">Executive Floor</div>
        <div class="office-floor">
          ${this.renderRoom('henry', '👨‍💼', 'CEO Office', 'Henry Finn', 'green', 'Strategy & Approvals', 'dashboard', true, 'rgba(251,191,36,0.1)')}
          ${this.renderRoom('sol', '☀️', 'Sol (COO)', '🧠 Brain', 'green', 'Orchestrating 27 agents', 'team', false, 'rgba(99,102,241,0.15)', true)}
        </div>

        <!-- Trading Desk -->
        <div class="floor-label">📈 Trading Desk</div>
        <div class="office-floor">
          ${this.renderRoom('scanner', '🔍', 'Scanner', '📡', 'amber', 'Monitoring markets', 'trading', false, 'rgba(52,211,153,0.1)', true)}
          ${this.renderRoom('analyst', '📊', 'Analyst', '🧮', 'amber', 'Validating signals', 'trading', false, 'rgba(52,211,153,0.1)')}
          ${this.renderRoom('executor', '⚡', 'Executor', '💹', 'dim', 'Awaiting API keys', 'trading', false, 'rgba(52,211,153,0.1)')}
        </div>

        <!-- Revenue Ops -->
        <div class="floor-label">💰 Revenue Operations</div>
        <div class="office-floor">
          ${this.renderRoom('prospector', '🎯', 'Prospector', '📋', 'amber', 'Building pipeline', 'comms', false, 'rgba(251,191,36,0.1)')}
          ${this.renderRoom('content-eng', '✍️', 'Content Engine', '📝', 'amber', 'Drafting posts', 'content', false, 'rgba(251,191,36,0.1)')}
          ${this.renderRoom('delivery', '🚀', 'Client Delivery', '🏗️', 'green', '8 products shipped', 'projects', false, 'rgba(251,191,36,0.1)', true)}
        </div>

        <!-- Dev Factory -->
        <div class="floor-label">🏗️ Dev Factory</div>
        <div class="office-floor">
          ${this.renderRoom('researcher', '🔬', 'Researcher', '💡', 'amber', 'Finding ideas', 'projects', false, 'rgba(34,211,238,0.1)')}
          ${this.renderRoom('builder1', '🔨', 'Builder 1', '⚙️', 'green', 'SoakAtlas: 137 springs', 'projects', false, 'rgba(34,211,238,0.1)', true)}
          ${this.renderRoom('builder2', '🔧', 'Builder 2', '🛠️', 'dim', 'Queued', 'projects', false, 'rgba(34,211,238,0.1)')}
          ${this.renderRoom('seo-arch', '📈', 'SEO Architect', '🏆', 'green', 'AI SEO on SoakAtlas', 'projects', false, 'rgba(34,211,238,0.1)')}
          ${this.renderRoom('data-build', '🗄️', 'Data Builder', '📦', 'green', 'Expanded to 19 states', 'projects', false, 'rgba(34,211,238,0.1)')}
        </div>

        <!-- Vibe Marketing -->
        <div class="floor-label">🔥 Vibe Marketing & Sales</div>
        <div class="office-floor">
          ${this.renderRoom('tiktok', '🎵', 'TikTok', '📱', 'amber', 'Hook formulas ready', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('reels', '📸', 'Reels', '🎬', 'amber', '6.6% carousel engage', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('shorts', '▶️', 'Shorts', '🎥', 'amber', '200B daily views', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('linkedin', '💼', 'LinkedIn', '📄', 'amber', '5 posts drafted', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('xtwitter', '🐦', 'X/Twitter', '🧵', 'amber', 'Thread strategy', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('reddit', '🕵️', 'Reddit', '💬', 'amber', 'Infiltration mode', 'content', false, 'rgba(255,45,85,0.1)')}
        </div>
        <div class="office-floor">
          ${this.renderRoom('seo-cmd', '🏆', 'SEO Commander', '🔎', 'green', '1,450+ page opportunities', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('ai-seo', '🤖', 'AI SEO', '📡', 'green', 'llms.txt deployed', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('viral-eng', '🧲', 'Viral Engineer', '🧪', 'amber', 'ROI Calculator next', 'content', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('outreach', '📧', 'Outreach', '💌', 'amber', '500 prospects/day target', 'comms', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('nurture', '💌', 'Lead Nurture', '🔄', 'dim', 'Queued', 'comms', false, 'rgba(255,45,85,0.1)')}
          ${this.renderRoom('closer', '🤝', 'Closer Prep', '📋', 'dim', 'Queued', 'comms', false, 'rgba(255,45,85,0.1)')}
        </div>
      </div>

      <!-- Live Activity Feed -->
      <div class="card" style="margin-top: 32px;">
        <div class="card-header">
          <span class="card-title">📊 Today's Activity Feed</span>
          <span class="badge badge-green">Day 2</span>
        </div>
        <div id="activity-feed">
          ${this.renderActivityFeed()}
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-3" style="margin-top: 24px;">
        <div class="card">
          <div class="card-header">
            <span class="card-title">🟢 Active</span>
          </div>
          <div style="text-align:center;padding:24px">
            <div style="font-size:2.5rem;font-weight:800;color:#34d399">8</div>
            <div style="font-size:0.8rem;color:var(--muted)">Agents working now</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">🟡 Building</span>
          </div>
          <div style="text-align:center;padding:24px">
            <div style="font-size:2.5rem;font-weight:800;color:#fbbf24">14</div>
            <div style="font-size:0.8rem;color:var(--muted)">Being configured</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">⚪ Queued</span>
          </div>
          <div style="text-align:center;padding:24px">
            <div style="font-size:2.5rem;font-weight:800;color:var(--muted)">5</div>
            <div style="font-size:0.8rem;color:var(--muted)">Waiting for dependencies</div>
          </div>
        </div>
      </div>

      <style>
      .office-container {
        padding: 24px 0;
        background: linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%);
        border-radius: 16px;
        overflow: hidden;
      }

      .office-title {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 800;
        margin-bottom: 24px;
        color: var(--text);
      }

      .floor-label {
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--muted);
        margin: 20px 0 8px;
        padding-top: 12px;
        border-top: 1px solid var(--border);
      }

      .floor-label:first-of-type { border-top: none; }

      .office-floor {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 0 16px;
        margin-bottom: 8px;
      }

      .room {
        width: 120px;
        height: 110px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .room:hover { transform: translateY(-6px); }

      .room-floor {
        position: absolute;
        bottom: 0;
        left: 6px;
        right: 6px;
        height: 55px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        transform: perspective(400px) rotateX(15deg);
      }

      .room-wall-back {
        position: absolute;
        bottom: 28px;
        left: 6px;
        right: 6px;
        height: 70px;
        border: 1px solid var(--border);
        border-radius: 8px 8px 0 0;
        border-bottom: none;
      }

      .room-label {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 0.6rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--muted);
      }

      .room-emoji {
        position: absolute;
        top: 12px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 1.8rem;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }

      .room-status {
        position: absolute;
        top: 6px;
        right: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .status-green { background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,0.6); }
      .status-amber { background: #fbbf24; box-shadow: 0 0 6px rgba(251,191,36,0.6); }
      .status-dim { background: #4b5563; }

      .room-speech {
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.85);
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 0.6rem;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 140px;
        text-align: center;
        z-index: 10;
      }

      .room:hover .room-speech { opacity: 1; }

      .room-speech::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid rgba(0,0,0,0.85);
      }

      .character {
        position: absolute;
        font-size: 0.9rem;
        bottom: 35px;
        left: 50%;
        transform: translateX(-50%);
        animation: work 3s ease-in-out infinite;
      }

      @keyframes work {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-3px); }
      }

      .particles {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none;
      }

      .particle {
        position: absolute;
        width: 2px; height: 2px;
        background: var(--primary-light);
        border-radius: 50%;
        opacity: 0.3;
        animation: float-up 4s ease-in-out infinite;
      }

      @keyframes float-up {
        0% { transform: translateY(0); opacity: 0.3; }
        50% { opacity: 0.6; }
        100% { transform: translateY(-20px); opacity: 0; }
      }

      .plumbob {
        position: absolute;
        top: -2px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.8rem;
        animation: plumbob-bob 2s ease-in-out infinite;
        filter: drop-shadow(0 0 4px rgba(52,211,153,0.6));
      }

      @keyframes plumbob-bob {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-6px); }
      }
      </style>
    `;
  }

  renderRoom(id, emoji, label, character, status, speech, route, hasPlumbob, wallColor, hasParticles) {
    return `
      <div class="room room-${id}" onclick="app.navigate('${route}')">
        <div class="room-wall-back" style="background: linear-gradient(180deg, ${wallColor || 'rgba(99,102,241,0.08)'}, var(--card))"></div>
        <div class="room-floor"></div>
        <div class="room-status status-${status}"></div>
        <div class="room-emoji">${emoji}</div>
        ${character ? `<div class="character">${character}</div>` : ''}
        <div class="room-label">${label}</div>
        <div class="room-speech">${speech}</div>
        ${hasPlumbob ? '<div class="plumbob">💎</div>' : ''}
        ${hasParticles ? `<div class="particles">
          <div class="particle" style="left:30%;top:20%;animation-delay:0.5s"></div>
          <div class="particle" style="left:70%;top:30%;animation-delay:2s"></div>
        </div>` : ''}
      </div>
    `;
  }

  renderActivityFeed() {
    const activities = [
      { agent: 'Sol', icon: '☀️', action: 'Built MARKETING-TEAM.md — 16 agents, 5 sub-teams', time: 'Just now', type: 'success' },
      { agent: 'Sol', icon: '☀️', action: 'Updated Mission Control with 27-agent org chart', time: '5 min ago', type: 'success' },
      { agent: 'Sol', icon: '☀️', action: 'Created SYSTEM-README.md — full playbook for teaching', time: '30 min ago', type: 'success' },
      { agent: 'Builder 1', icon: '🔨', action: 'SoakAtlas expanded: 49 → 137 springs, 19 states', time: '1 hour ago', type: 'success' },
      { agent: 'SEO Arch', icon: '📈', action: 'Regenerated llms.txt + llms-full.txt (137 springs)', time: '1 hour ago', type: 'success' },
      { agent: 'Builder 1', icon: '🔨', action: 'Deployed SoakAtlas — 155 static pages', time: '1 hour ago', type: 'success' },
      { agent: 'Sol', icon: '☀️', action: 'Created BUILD-QUEUE.md — dev factory pipeline', time: '2 hours ago', type: 'success' },
      { agent: 'Builder 1', icon: '🔨', action: 'VitaLog funnel v2 deployed (blue+pink theme)', time: '3 hours ago', type: 'success' },
      { agent: 'Sol', icon: '☀️', action: 'Designed 11-agent org structure', time: '4 hours ago', type: 'info' },
      { agent: 'Data Builder', icon: '🗄️', action: 'Added NV(10), AZ(5), MT(10), WY(6) springs', time: '5 hours ago', type: 'success' },
      { agent: 'Henry', icon: '👨‍💼', action: 'Shared Vibe Marketing University playbook', time: '6 hours ago', type: 'info' },
      { agent: 'Henry', icon: '👨‍💼', action: 'Requested 24/7 dev factory + marketing team', time: '6 hours ago', type: 'info' },
    ];

    return activities.map(a => {
      const icon = a.type === 'success' ? '✅' : 'ℹ️';
      return `
        <div class="list-item">
          <div class="list-icon">${a.icon}</div>
          <div class="list-content">
            <div class="list-title"><strong>${a.agent}</strong> ${a.action}</div>
            <div class="list-subtitle">${a.time}</div>
          </div>
          <div class="list-meta">${icon}</div>
        </div>
      `;
    }).join('');
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['office'] = OfficePage;
