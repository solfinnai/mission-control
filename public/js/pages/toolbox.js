/**
 * Toolbox Page - Skills & Tools available to the agent network
 */
class ToolboxPage {
  constructor() {
    this.name = 'ToolboxPage';
  }

  async render(container, params = []) {
    container.innerHTML = `
      <div class="page-header">
        <h1>🧰 Toolbox</h1>
        <p class="page-desc">Skills, tools, and automations available to the agent network. Tell Sol to use any of these.</p>
      </div>

      <!-- Quick Actions -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #34d399;">
        <div class="card-header">
          <span class="card-title">⚡ Quick Actions</span>
          <span class="badge badge-green">Just paste & go</span>
        </div>
        <p style="padding:0 16px 8px; font-size:0.85rem; color:var(--muted)">
          Send any of these to Sol in Telegram. No setup needed — just paste the link or type the command.
        </p>
        <div class="toolbox-grid">
          ${this.renderQuickAction('🎬', 'YouTube → Summary', 'Paste a YouTube link. Get: full transcript, key takeaways, action items, Google Doc export.', 'Paste any YouTube URL')}
          ${this.renderQuickAction('🌐', 'Webpage → Brief', 'Paste any URL. Get: clean summary, key points, relevant quotes extracted.', 'Paste any URL')}
          ${this.renderQuickAction('📄', 'PDF → Analysis', 'Send a PDF. Get: summary, key findings, structured notes.', 'Attach a PDF')}
          ${this.renderQuickAction('🖼️', 'Image → Description', 'Send an image. Get: detailed analysis, text extraction (OCR), context.', 'Attach an image')}
          ${this.renderQuickAction('🎤', 'Audio → Transcript', 'Send a voice memo or audio file. Get: full transcription + summary.', 'Attach audio file')}
          ${this.renderQuickAction('📊', 'Competitor → Report', 'Give a company name or URL. Get: full competitive analysis report.', '"Analyze competitor: [name]"')}
        </div>
      </div>

      <!-- Installed Skills -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #6366f1;">
        <div class="card-header">
          <span class="card-title">🔌 Installed Skills</span>
          <span class="badge badge-purple">OpenClaw Native</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Skill</th><th>What It Does</th><th>Trigger</th><th>Status</th></tr></thead>
          <tbody>
            ${this.renderSkillRow('📧', 'Himalaya (Email)', 'Read, write, reply, search emails via IMAP/SMTP', '"Check my email" / "Send email to..."', 'ready')}
            ${this.renderSkillRow('🐦', 'X/Twitter (xurl)', 'Post tweets, search, reply, manage followers via X API', '"Tweet: ..." / "Search X for..."', 'ready')}
            ${this.renderSkillRow('📱', 'WhatsApp (wacli)', 'Send WhatsApp messages, search/sync history', '"Send WhatsApp to..."', 'ready')}
            ${this.renderSkillRow('🍎', 'Apple Notes', 'Create, view, edit, search Apple Notes', '"Add a note: ..." / "Search notes"', 'ready')}
            ${this.renderSkillRow('✅', 'Apple Reminders', 'Add, list, complete reminders', '"Remind me to..." / "Show reminders"', 'ready')}
            ${this.renderSkillRow('📋', 'Things 3', 'Add/update tasks and projects in Things', '"Add task: ..." / "Show today"', 'ready')}
            ${this.renderSkillRow('🔐', '1Password', 'Read/inject secrets via 1Password CLI', '"Get password for..."', 'ready')}
            ${this.renderSkillRow('🐙', 'GitHub (gh)', 'Issues, PRs, CI runs, code review', '"Check PR status" / "Create issue"', 'ready')}
            ${this.renderSkillRow('🏗️', 'Coding Agent', 'Spawn Claude Code / Codex for builds', '"Build me a..." / code tasks', 'ready')}
            ${this.renderSkillRow('🌤️', 'Weather', 'Current weather and forecasts', '"Weather in Tokyo"', 'ready')}
            ${this.renderSkillRow('📰', 'Blog Watcher', 'Monitor RSS/Atom feeds for updates', '"Watch [blog URL]"', 'ready')}
            ${this.renderSkillRow('🎥', 'Video Frames', 'Extract frames/clips from videos via ffmpeg', '"Extract frames from [video]"', 'ready')}
            ${this.renderSkillRow('📝', 'PDF Editor', 'Edit PDFs with natural language', '"Edit this PDF: ..."', 'ready')}
            ${this.renderSkillRow('🎙️', 'Whisper (Local)', 'Local speech-to-text transcription', '"Transcribe [audio file]"', 'ready')}
            ${this.renderSkillRow('🎙️', 'Whisper (API)', 'Cloud speech-to-text via OpenAI', '"Transcribe [audio file]"', 'ready')}
            ${this.renderSkillRow('🖼️', 'Image Gen', 'Generate images via OpenAI DALL-E', '"Generate image: ..."', 'ready')}
            ${this.renderSkillRow('💎', 'Gemini', 'One-shot Q&A via Gemini CLI', '"Ask Gemini: ..."', 'ready')}
            ${this.renderSkillRow('🔍', 'Web Search', 'Search via Brave Search API', '"Search for..."', 'needs-key')}
            ${this.renderSkillRow('📓', 'Obsidian', 'Manage Obsidian vault notes', '"Add to Obsidian: ..."', 'ready')}
          </tbody>
        </table>
      </div>

      <!-- Custom Workflows -->
      <div class="card" style="margin-bottom:24px; border-left: 3px solid #ff2d55;">
        <div class="card-header">
          <span class="card-title">🔄 Custom Workflows</span>
          <span class="badge" style="background:rgba(255,45,85,0.15);color:#ff2d55">Automations</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Workflow</th><th>Pipeline</th><th>Output</th><th>Status</th></tr></thead>
          <tbody>
            ${this.renderWorkflowRow('🎬', 'YouTube → Research', 'yt-dlp extract → Whisper transcribe → Claude summarize → Google Doc', 'Transcript + Summary + Doc', 'active')}
            ${this.renderWorkflowRow('🏗️', 'Dev Factory Build', 'Idea brief → Claude Code scaffold → Build → Deploy → SEO → Log', 'Deployed MVP', 'active')}
            ${this.renderWorkflowRow('📈', 'Trading Signal', 'Scanner → Analyst validates → Risk check → Present to Henry', 'Trade recommendation', 'building')}
            ${this.renderWorkflowRow('📧', 'Outreach Pipeline', 'Prospect research → Personalize → Send → Track → Follow-up', 'Warm leads', 'planned')}
            ${this.renderWorkflowRow('📱', 'Content Pipeline', 'Trending topic → Platform-specific content → Schedule → Post', '10-15 posts/day', 'planned')}
            ${this.renderWorkflowRow('🔍', 'SEO Content', 'Keyword research → Generate article → Optimize (Surfer) → Publish', 'Ranked content', 'planned')}
          </tbody>
        </table>
      </div>

      <!-- Add New Tool -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <span class="card-title">➕ Request a New Tool</span>
        </div>
        <div style="padding:16px; font-size:0.85rem; color:var(--muted)">
          <p>Want Sol to learn a new skill? Just tell him:</p>
          <ul style="margin:8px 0; padding-left:20px; line-height:2">
            <li><code>"Create a skill that does [X]"</code> — Sol will build and install it</li>
            <li><code>"Install [tool name]"</code> — Sol will set up CLI tools</li>
            <li><code>"Connect [service]"</code> — Sol will configure API integrations</li>
            <li><code>"When I send [trigger], do [action]"</code> — Sol will create a custom workflow</li>
          </ul>
          <p style="margin-top:12px">Browse community skills: <a href="https://clawhub.com" target="_blank" style="color:var(--primary-light)">clawhub.com</a></p>
        </div>
      </div>

      <!-- Platform Keys Status -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔑 API Keys & Connections</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Service</th><th>Purpose</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr>
              <td>Anthropic (Claude)</td>
              <td>AI brain for all agents</td>
              <td><span class="status-dot green"></span> Connected</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Deployment platform</td>
              <td><span class="status-dot green"></span> Connected</td>
              <td>—</td>
            </tr>
            <tr>
              <td>GitHub</td>
              <td>Code repos</td>
              <td><span class="status-dot green"></span> Connected</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Telegram</td>
              <td>Primary messaging</td>
              <td><span class="status-dot green"></span> Connected</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Brave Search</td>
              <td>Web research</td>
              <td><span class="status-dot amber"></span> Needs Key</td>
              <td><code>openclaw configure --section web</code></td>
            </tr>
            <tr>
              <td>Supabase</td>
              <td>Database (VitaLog)</td>
              <td><span class="status-dot amber"></span> Needs Setup</td>
              <td>Provide URL + anon key</td>
            </tr>
            <tr>
              <td>Kalshi</td>
              <td>Prediction markets</td>
              <td><span class="status-dot amber"></span> Needs API Key</td>
              <td>Fund account + generate RSA key</td>
            </tr>
            <tr>
              <td>OpenAI</td>
              <td>Whisper, DALL-E, Codex</td>
              <td><span class="status-dot dim"></span> Not Set</td>
              <td>Add API key</td>
            </tr>
            <tr>
              <td>Google (OAuth)</td>
              <td>Google Docs export</td>
              <td><span class="status-dot dim"></span> Not Set</td>
              <td>Set up service account</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>
      .toolbox-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        padding: 0 16px 16px;
      }
      @media (max-width: 900px) { .toolbox-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 600px) { .toolbox-grid { grid-template-columns: 1fr; } }
      .quick-action {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .quick-action:hover {
        border-color: var(--primary-light);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99,102,241,0.15);
      }
      .quick-action-icon { font-size: 1.5rem; margin-bottom: 8px; }
      .quick-action-title { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; }
      .quick-action-desc { font-size: 0.75rem; color: var(--muted); line-height: 1.4; margin-bottom: 8px; }
      .quick-action-trigger {
        font-size: 0.7rem;
        color: var(--primary-light);
        background: rgba(99,102,241,0.1);
        padding: 4px 8px;
        border-radius: 6px;
        display: inline-block;
      }
      </style>
    `;
  }

  renderQuickAction(icon, title, desc, trigger) {
    return `
      <div class="quick-action">
        <div class="quick-action-icon">${icon}</div>
        <div class="quick-action-title">${title}</div>
        <div class="quick-action-desc">${desc}</div>
        <div class="quick-action-trigger">${trigger}</div>
      </div>
    `;
  }

  renderSkillRow(icon, name, description, trigger, status) {
    const statusHtml = status === 'ready' 
      ? '<span class="status-dot green"></span> Ready'
      : status === 'needs-key'
      ? '<span class="status-dot amber"></span> Needs Key'
      : '<span class="status-dot dim"></span> Not Set';
    return `
      <tr>
        <td><strong>${icon} ${name}</strong></td>
        <td>${description}</td>
        <td><code style="font-size:0.75rem">${trigger}</code></td>
        <td>${statusHtml}</td>
      </tr>
    `;
  }

  renderWorkflowRow(icon, name, pipeline, output, status) {
    const badges = {
      active: '<span class="badge badge-green">Active</span>',
      building: '<span class="badge badge-amber">Building</span>',
      planned: '<span class="badge badge-blue">Planned</span>'
    };
    return `
      <tr>
        <td><strong>${icon} ${name}</strong></td>
        <td style="font-size:0.8rem">${pipeline}</td>
        <td>${output}</td>
        <td>${badges[status] || ''}</td>
      </tr>
    `;
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['toolbox'] = ToolboxPage;
