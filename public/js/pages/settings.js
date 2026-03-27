class SettingsPage {
  constructor() {
    this.services = [
      { name: 'Telegram (henryfinnai)', icon: '💬', status: 'connected', color: 'green' },
      { name: 'Telegram (starlordyftw)', icon: '💬', status: 'connected', color: 'green' },
      { name: 'WhatsApp', icon: '📱', status: 'connected', color: 'green' },
      { name: 'Gmail / Calendar / Drive', icon: '📧', status: 'connected', color: 'green' },
      { name: 'Vercel', icon: '▲', status: 'connected', color: 'green' },
      { name: 'Claude Code (Sonnet)', icon: '✍️', status: 'connected', color: 'green' },
      { name: 'Twitter / X', icon: '🐦', status: 'pending', color: 'amber' },
      { name: 'Kalshi', icon: '📈', status: 'approved', color: 'green' },
      { name: 'Codex (OpenAI)', icon: '⚡', status: 'needs API key', color: 'red' },
      { name: 'GoDaddy (EI domain)', icon: '🌐', status: 'needs DNS config', color: 'amber' },
      { name: 'Gumroad', icon: '💳', status: 'needs email confirm', color: 'amber' },
      { name: 'Polymarket', icon: '📊', status: 'not set up', color: 'red' },
      { name: 'Himalaya (Email CLI)', icon: '📮', status: 'not set up', color: 'red' },
    ];
  }

  async render(container, params = []) {
    const services = this.services;
    const activeCount = services.filter(s => s.color === 'green').length;

    const serviceCards = services.map(s => `
      <div class="service-item">
        <div class="service-icon">${s.icon}</div>
        <div class="service-info">
          <div class="service-name">${s.name}</div>
          <div class="service-status">
            <span class="status-dot ${s.color}"></span>
            ${s.status}
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="page-header">
        <h1>⚙️ Settings</h1>
        <p class="page-desc">Connected services, model configuration, and workspace info</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">OpenClaw Status</span>
          <span class="badge badge-green">Running</span>
        </div>
        <div class="config-list">
          <div class="config-row">
            <span class="config-label">Connected Integrations</span>
            <span class="config-value">Google, Telegram, WhatsApp, Vercel</span>
          </div>
          <div class="config-row">
            <span class="config-label">API Keys</span>
            <span class="config-value"><span class="badge badge-green">Anthropic</span> <span class="badge badge-green">OpenAI</span> <span class="badge badge-green">Google</span></span>
          </div>
          <div class="config-row">
            <span class="config-label">Workspace Path</span>
            <span class="config-value config-mono">~/.openclaw/workspace</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Connected Services</span>
          <span class="badge badge-blue">${activeCount}/${services.length} Active</span>
        </div>
        <div class="services-grid">${serviceCards}</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Model Configuration</span>
          </div>
          <div class="config-list">
            <div class="config-row">
              <span class="config-label">Primary (Brain)</span>
              <span class="config-value"><span class="badge badge-purple">claude-opus-4</span></span>
            </div>
            <div class="config-row">
              <span class="config-label">Workhorse</span>
              <span class="config-value"><span class="badge badge-cyan">claude-sonnet-4</span></span>
            </div>
            <div class="config-row">
              <span class="config-label">Builder</span>
              <span class="config-value"><span class="badge badge-green">gpt-5.3-codex</span></span>
            </div>
            <div class="config-row">
              <span class="config-label">Default Channel</span>
              <span class="config-value">Telegram</span>
            </div>
            <div class="config-row">
              <span class="config-label">Heartbeat Interval</span>
              <span class="config-value">~10 min</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Workspace</span>
          </div>
          <div class="config-list">
            <div class="config-row">
              <span class="config-label">Path</span>
              <span class="config-value config-mono">~/.openclaw/workspace</span>
            </div>
            <div class="config-row">
              <span class="config-label">Agent</span>
              <span class="config-value">Sol Finn</span>
            </div>
            <div class="config-row">
              <span class="config-label">Created</span>
              <span class="config-value">2026-03-12 (Day 1)</span>
            </div>
            <div class="config-row">
              <span class="config-label">Runtime</span>
              <span class="config-value">OpenClaw on macOS (arm64)</span>
            </div>
            <div class="config-row">
              <span class="config-label">Node</span>
              <span class="config-value">v22.22.1</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">How to Talk to Sol</span>
        </div>
        <div class="instructions">
          <div class="instruction-item">
            <div class="instruction-icon">💬</div>
            <div>
              <strong>Telegram</strong> — Message @henryfinnai bot directly. Full conversation with memory.
            </div>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon">📱</div>
            <div>
              <strong>WhatsApp</strong> — Message +1 (415) 531-8881. Same capabilities as Telegram.
            </div>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon">🖥️</div>
            <div>
              <strong>Terminal</strong> — Run <code>openclaw chat</code> for direct CLI conversation.
            </div>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon">📋</div>
            <div>
              <strong>Mission Control</strong> — Chat integration coming soon. For now, use Telegram or WhatsApp.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['settings'] = SettingsPage;
