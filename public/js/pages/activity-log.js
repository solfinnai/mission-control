/**
 * Activity Log Page - Full action history
 * Shows all actions, deployments, sub-agents, and errors
 * Updated: 2026-03-14
 */
class ActivityLogPage {
  constructor() {
    this.data = null;
    this.refreshInterval = null;
    this.activeFilter = 'all';
  }

  getActivityData() {
    return [
      // Deployments
      { time: '3:30 PM', date: 'Mar 14', type: 'deploy', icon: '🚀', description: "Fat Henry's Burger Paradise deployed", detail: 'https://fat-henrys.vercel.app', status: 'done' },
      { time: '2:15 PM', date: 'Mar 14', type: 'deploy', icon: '🚀', description: 'SoakAtlas deployed (292 springs)', detail: 'https://hot-springs.vercel.app', status: 'done' },
      { time: '1:45 PM', date: 'Mar 14', type: 'deploy', icon: '🚀', description: 'FertilityFinder deployed (80+ clinics)', detail: 'https://fertility-clinics.vercel.app', status: 'done' },
      { time: '12:30 PM', date: 'Mar 14', type: 'deploy', icon: '🚀', description: 'Website Roaster + Factory deployed', detail: 'https://website-roaster.vercel.app', status: 'done' },

      // Google Drive Uploads
      { time: '11:23 PM', date: 'Mar 13', type: 'upload', icon: '📁', description: 'brand-naming-guide.md uploaded', detail: 'Google Drive → Brand Naming/', status: 'done' },
      { time: '11:23 PM', date: 'Mar 13', type: 'upload', icon: '📁', description: 'brand-name-scorecard.md uploaded', detail: 'Google Drive → Brand Naming/', status: 'done' },
      { time: '9:05 PM', date: 'Mar 13', type: 'upload', icon: '📁', description: 'Game Theory #3 transcript + summary uploaded', detail: 'Google Drive → YouTube Transcripts/', status: 'done' },
      { time: '8:00 PM', date: 'Mar 13', type: 'upload', icon: '📁', description: '33 channel transcripts (41 files) uploaded', detail: 'Google Drive → YouTube Transcripts/Channels/', status: 'done' },

      // System Changes
      { time: '7:50 PM', date: 'Mar 14', type: 'system', icon: '🔧', description: 'Activity logging system created', detail: 'Mission Control activity tracking', status: 'done' },
      { time: '3:30 PM', date: 'Mar 14', type: 'system', icon: '🔧', description: 'Obsidian vault structured (11 folders)', detail: 'Knowledge management system', status: 'done' },
      { time: '12:41 AM', date: 'Mar 14', type: 'system', icon: '🔧', description: 'Gemini API configured', detail: 'Google AI integration', status: 'done' },
      { time: '12:32 AM', date: 'Mar 14', type: 'system', icon: '🔧', description: 'DELEGATION.md created (brain-muscle routing)', detail: 'Task delegation framework', status: 'done' },

      // Sub-Agents
      { time: '9:00 PM', date: 'Mar 13', type: 'sub-agent', icon: '🤖', description: 'Sonnet: Game Theory summary', detail: 'Completed successfully', status: 'done' },
      { time: '11:20 PM', date: 'Mar 13', type: 'sub-agent', icon: '🤖', description: 'Sonnet: Brand naming guide + scorecard', detail: 'Completed successfully', status: 'done' },
      { time: '2:00 PM', date: 'Mar 14', type: 'sub-agent', icon: '🤖', description: "Codex: Fat Henry's website", detail: 'Build failed (exit 1) → Rebuilt with Claude Code', status: 'failed' },
      { time: '3:00 PM', date: 'Mar 14', type: 'sub-agent', icon: '🤖', description: "Claude Code: Fat Henry's website", detail: 'Rebuilt after Codex failure', status: 'done' },
      { time: '3:49 PM', date: 'Mar 13', type: 'sub-agent', icon: '🤖', description: 'Sonnet: 33 YouTube transcripts', detail: '7 channels processed', status: 'done' },
      { time: '6:00 PM', date: 'Mar 14', type: 'sub-agent', icon: '🤖', description: 'Sonnet: EI Playbook v2 HTML', detail: 'Building expanded version', status: 'in-progress' },
      { time: '6:30 PM', date: 'Mar 14', type: 'sub-agent', icon: '🤖', description: 'Sonnet: ClassicWrench directory', detail: 'Building automotive directory', status: 'in-progress' },

      // Errors
      { time: '2:00 PM', date: 'Mar 14', type: 'error', icon: '⚠️', description: "Codex failed Fat Henry's build (exit 1)", detail: 'Resolved: Rebuilt with Claude Code', status: 'failed' },
      { time: '4:00 PM', date: 'Mar 13', type: 'error', icon: '⚠️', description: 'OpenAI Whisper API quota exhausted', detail: 'Resolved: Used local Whisper', status: 'failed' },
      { time: '12:00 PM', date: 'Mar 14', type: 'error', icon: '⚠️', description: 'Gemini free tier exhausted', detail: 'Resolved: Henry enabled billing', status: 'failed' },
    ];
  }

  getFilteredData() {
    const data = this.getActivityData();
    if (this.activeFilter === 'all') return data;
    return data.filter(item => item.type === this.activeFilter);
  }

  getStats() {
    const data = this.getActivityData();
    return {
      total: data.length,
      deployments: data.filter(d => d.type === 'deploy').length,
      errors: data.filter(d => d.type === 'error').length,
      subAgents: data.filter(d => d.type === 'sub-agent').length,
    };
  }

  async render(container, params = []) {
    try {
      const stats = this.getStats();
      const filtered = this.getFilteredData();

      container.innerHTML = `
        <div class="grid grid-4">

          <!-- Header Stats -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">📋 Total Actions</span>
            </div>
            <div class="big-number">${stats.total}</div>
            <div class="big-label">Today</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">🚀 Deployments</span>
            </div>
            <div class="big-number" style="color: #22c55e;">${stats.deployments}</div>
            <div class="big-label">Sites shipped</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">⚠️ Errors</span>
            </div>
            <div class="big-number" style="color: #ef4444;">${stats.errors}</div>
            <div class="big-label">All resolved</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">🤖 Sub-Agents</span>
            </div>
            <div class="big-number" style="color: #60a5fa;">${stats.subAgents}</div>
            <div class="big-label">Spawned</div>
          </div>

          <!-- Filter Bar -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">🔍 Filter Actions</span>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn ${this.activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" data-filter="all">All</button>
              <button class="btn ${this.activeFilter === 'deploy' ? 'btn-primary' : 'btn-secondary'}" data-filter="deploy">🚀 Deployments</button>
              <button class="btn ${this.activeFilter === 'upload' ? 'btn-primary' : 'btn-secondary'}" data-filter="upload">📁 Uploads</button>
              <button class="btn ${this.activeFilter === 'system' ? 'btn-primary' : 'btn-secondary'}" data-filter="system">🔧 System</button>
              <button class="btn ${this.activeFilter === 'sub-agent' ? 'btn-primary' : 'btn-secondary'}" data-filter="sub-agent">🤖 Sub-Agents</button>
              <button class="btn ${this.activeFilter === 'error' ? 'btn-primary' : 'btn-secondary'}" data-filter="error">⚠️ Errors</button>
            </div>
          </div>

          <!-- Live Activity Feed -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">📜 Activity Feed</span>
              <span class="badge badge-green">${filtered.length} actions</span>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Action</th>
                  <th>Detail</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(item => `
                  <tr>
                    <td style="white-space: nowrap; font-size: 0.8rem; color: #9ca3af;">${item.time}<br><span style="font-size: 0.7rem; color: #6b7280;">${item.date}</span></td>
                    <td style="font-size: 1.1rem; text-align: center;">${item.icon}</td>
                    <td style="font-weight: 500; color: #fff;">${item.description}</td>
                    <td style="font-size: 0.8rem; color: #9ca3af;">${item.detail.startsWith('http') ? `<a href="${item.detail}" target="_blank" style="color: #60a5fa; text-decoration: none;">${item.detail}</a>` : item.detail}</td>
                    <td><span class="badge badge-${item.status === 'done' ? 'green' : item.status === 'failed' ? 'red' : 'yellow'}">${item.status === 'done' ? '✅ Done' : item.status === 'failed' ? '❌ Failed' : '🔄 In Progress'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Permissions Log -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">🔐 Permissions Log</span>
              <span class="badge badge-blue">Delegation Rules</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <div style="font-weight: 600; color: #22c55e; margin-bottom: 12px; font-size: 0.9rem;">✅ Auto-Approved (Sol can do independently)</div>
                ${this.renderPermissionList([
                  'Vercel deployments (all projects)',
                  'Google Drive uploads (all folders)',
                  'File creation & editing',
                  'YouTube transcript extraction',
                  'Sub-agent spawning (Sonnet, Haiku)',
                  'Obsidian vault management',
                  'Git commits & pushes',
                  'Local Whisper transcription',
                  'API configuration (non-billing)',
                  'Mission Control updates',
                ], 'green')}
              </div>
              <div>
                <div style="font-weight: 600; color: #f59e0b; margin-bottom: 12px; font-size: 0.9rem;">⚠️ Requires Henry's Approval</div>
                ${this.renderPermissionList([
                  'Sending emails to external contacts',
                  'Financial transactions (Stripe, Kalshi)',
                  'Domain purchases',
                  'API billing changes',
                  'Publishing to social media',
                  'Client-facing communications',
                  'Deleting production data',
                  'Third-party account creation',
                  'Spending money (any amount)',
                  'Changing DNS records',
                ], 'amber')}
              </div>
            </div>
          </div>

        </div>
      `;

      this.setupEventListeners();

    } catch (error) {
      console.error('Failed to render activity log:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Activity Log Error</h2>
          <p>Failed to load activity data: ${error.message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  renderPermissionList(items, color) {
    return items.map(item => `
      <div class="list-item" style="padding: 6px 12px; margin-bottom: 4px;">
        <span style="color: ${color === 'green' ? '#22c55e' : '#f59e0b'}; margin-right: 8px;">●</span>
        <span style="font-size: 0.82rem; color: #d1d5db;">${item}</span>
      </div>
    `).join('');
  }

  setupEventListeners() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeFilter = e.target.dataset.filter;
        const container = document.getElementById('content-area');
        this.render(container);
      });
    });
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
window.PageModules['activity-log'] = ActivityLogPage;
