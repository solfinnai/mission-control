/**
 * Communications Hub Page - Mission Control Communications Management
 */
class CommsPage {
  constructor() {
    this.emailSummary = null;
    this.outreachPipeline = null;
    this.stageStats = null;
    this.recentMessages = null;
    this.keyContacts = null;
    this.outreachStatus = null;
  }

  getStageColor(stage) {
    const colors = {
      'Contacted': 'blue',
      'Responded': 'amber',
      'Meeting Booked': 'cyan',
      'Converted': 'green'
    };
    return colors[stage] || 'blue';
  }

  getMessageTypeIcon(type) {
    const icons = {
      'client': '\u{1F464}',
      'system': '\u{1F527}',
      'newsletter': '\u{1F4F0}',
      'support': '\u{1F4AC}'
    };
    return icons[type] || '\u{1F4E7}';
  }

  loadData() {
    // Mock email summary data (himalaya not set up yet)
    this.emailSummary = {
      unread: 23,
      important: 5,
      flagged: 2,
      lastSync: new Date().toISOString()
    };

    // Mock outreach pipeline data
    this.outreachPipeline = [
      {
        id: 1,
        name: "Alex Chen",
        company: "TechFlow Ventures",
        email: "alex.chen@techflow.vc",
        stage: "Contacted",
        lastContact: "2026-03-12",
        notes: "Interested in Executive Intelligence demo",
        value: "$50K",
        priority: "high"
      },
      {
        id: 2,
        name: "Sarah Wilson",
        company: "DataScale Inc",
        email: "sarah@datascale.com",
        stage: "Responded",
        lastContact: "2026-03-11",
        notes: "Wants to see Kalshi bot performance data",
        value: "$25K",
        priority: "medium"
      },
      {
        id: 3,
        name: "Marcus Rodriguez",
        company: "AI Ventures",
        email: "marcus@aiventures.co",
        stage: "Meeting Booked",
        lastContact: "2026-03-10",
        notes: "Demo scheduled for March 15th",
        value: "$75K",
        priority: "high"
      },
      {
        id: 4,
        name: "Jenny Kim",
        company: "Growth Partners",
        email: "jenny@growthpartners.io",
        stage: "Converted",
        lastContact: "2026-03-09",
        notes: "Signed contract for Executive Intelligence",
        value: "$35K",
        priority: "high"
      }
    ];

    this.stageStats = {
      "Contacted": 8,
      "Responded": 5,
      "Meeting Booked": 3,
      "Converted": 2
    };

    this.recentMessages = [
      {
        from: "Alex Chen",
        subject: "Re: Executive Intelligence Demo Request",
        time: "2 hours ago",
        type: "client",
        unread: true
      },
      {
        from: "GitHub",
        subject: "Security alert: new login detected",
        time: "4 hours ago",
        type: "system",
        unread: true
      },
      {
        from: "Marcus Rodriguez",
        subject: "Demo feedback and next steps",
        time: "1 day ago",
        type: "client",
        unread: false
      },
      {
        from: "Stripe",
        subject: "Payment received: $35,000",
        time: "2 days ago",
        type: "system",
        unread: false
      }
    ];

    this.keyContacts = [
      { name: "Brett", role: "Mentor", status: "warm", notes: "Regular check-ins, strategic guidance" },
      { name: "Alex Chen", role: "Prospect", status: "warm", notes: "TechFlow Ventures - demo requested" },
      { name: "Marcus Rodriguez", role: "Prospect", status: "warm", notes: "AI Ventures - demo scheduled" },
      { name: "Sarah Wilson", role: "Prospect", status: "cold", notes: "DataScale Inc - initial response" }
    ];

    this.outreachStatus = {
      templatesAvailable: 6,
      warmProspects: 3,
      coldProspects: 5,
      totalSent: 42,
      responseRate: "31%",
      meetingsBooked: 3,
      converted: 2
    };
  }

  setupEventListeners(container) {
    container.addEventListener('click', (e) => {
      const actionCard = e.target.closest('.action-card');
      if (!actionCard) return;

      const action = actionCard.dataset.action;
      if (action === 'compose') {
        alert('Himalaya email client setup required');
      } else if (action === 'add-lead') {
        alert('CRM integration coming soon');
      } else if (action === 'template') {
        alert('Template system in development');
      }
    });
  }

  async render(container, params = []) {
    try {
      this.loadData();

      const emailSummary = this.emailSummary;
      const outreachPipeline = this.outreachPipeline;
      const stageStats = this.stageStats;
      const recentMessages = this.recentMessages;
      const keyContacts = this.keyContacts;
      const outreachStatus = this.outreachStatus;

      container.innerHTML = `
        <style>
          .email-metric {
            text-align: center;
            padding: 16px;
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
          }

          .text-red { color: var(--red); }
          .text-amber { color: var(--amber); }
          .text-blue { color: var(--primary-light); }
          .text-green { color: var(--green); }

          .sync-status {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
            font-size: 0.8rem;
            color: var(--muted);
          }

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .status-pending {
            background: var(--amber);
            animation: pulse 2s infinite;
          }

          .pipeline-stages {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .pipeline-stage {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .stage-header {
            min-width: 140px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .stage-name {
            font-weight: 600;
            font-size: 0.85rem;
          }

          .stage-count {
            font-weight: 700;
            color: var(--primary-light);
          }

          .stage-bar {
            flex: 1;
            height: 8px;
            background: rgba(255,255,255,0.06);
            border-radius: 4px;
            overflow: hidden;
          }

          .stage-fill {
            height: 100%;
            transition: width 1s ease;
            border-radius: 4px;
          }

          .stage-contacted { background: var(--primary); }
          .stage-responded { background: var(--amber); }
          .stage-meeting-booked { background: var(--cyan); }
          .stage-converted { background: var(--green); }

          .pipeline-value {
            font-size: 0.85rem;
            color: var(--muted);
          }

          .pipeline-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-height: 400px;
            overflow-y: auto;
          }

          .lead-item {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
          }

          .lead-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4px;
          }

          .lead-name {
            font-weight: 700;
            font-size: 0.9rem;
          }

          .lead-value {
            font-weight: 700;
            color: var(--green);
            font-size: 0.85rem;
          }

          .lead-company {
            color: var(--muted);
            font-size: 0.8rem;
            margin-bottom: 8px;
          }

          .lead-details {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
          }

          .lead-priority {
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
          }

          .priority-high {
            background: rgba(248,113,113,0.15);
            color: var(--red);
          }

          .priority-medium {
            background: rgba(251,191,36,0.15);
            color: var(--amber);
          }

          .priority-low {
            background: rgba(156,163,175,0.15);
            color: var(--dim);
          }

          .lead-notes {
            font-size: 0.8rem;
            color: var(--muted);
            margin-bottom: 6px;
          }

          .lead-contact {
            font-size: 0.75rem;
            color: var(--dim);
          }

          .messages-list {
            display: flex;
            flex-direction: column;
            gap: 1px;
          }

          .message-item {
            padding: 12px;
            border-bottom: 1px solid var(--border);
            position: relative;
            transition: background-color 0.2s ease;
          }

          .message-item:hover {
            background: rgba(255,255,255,0.03);
          }

          .message-unread {
            background: rgba(99,102,241,0.05);
            border-left: 3px solid var(--primary);
          }

          .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          }

          .message-from {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 600;
            font-size: 0.85rem;
          }

          .message-type-icon {
            font-size: 0.8rem;
          }

          .message-time {
            font-size: 0.75rem;
            color: var(--muted);
          }

          .message-subject {
            font-size: 0.8rem;
            color: var(--muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .unread-indicator {
            position: absolute;
            top: 50%;
            right: 8px;
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            transform: translateY(-50%);
          }

          .message-actions {
            padding: 16px 0 0 0;
            border-top: 1px solid var(--border);
            margin-top: 16px;
          }

          .action-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            display: block;
            width: 100%;
          }

          .action-card:hover {
            background: rgba(255,255,255,0.06);
            border-color: var(--border-hover);
            transform: translateY(-2px);
          }

          .action-icon {
            font-size: 2rem;
            margin-bottom: 8px;
          }

          .action-title {
            font-weight: 700;
            font-size: 0.9rem;
            margin-bottom: 4px;
            color: var(--text);
          }

          .action-subtitle {
            font-size: 0.75rem;
            color: var(--muted);
          }

          .outreach-status-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }

          .outreach-stat {
            text-align: center;
            padding: 12px;
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
          }

          .outreach-stat-value {
            font-size: 1.4rem;
            font-weight: 700;
          }

          .outreach-stat-label {
            font-size: 0.75rem;
            color: var(--muted);
            margin-top: 4px;
          }

          .key-contacts-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
            border-radius: 10px;
          }

          .contact-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.85rem;
            flex-shrink: 0;
          }

          .contact-avatar-warm {
            background: rgba(251,191,36,0.2);
            color: var(--amber);
          }

          .contact-avatar-cold {
            background: rgba(99,102,241,0.2);
            color: var(--primary-light);
          }

          .contact-info {
            flex: 1;
            min-width: 0;
          }

          .contact-name {
            font-weight: 600;
            font-size: 0.85rem;
          }

          .contact-role {
            font-size: 0.75rem;
            color: var(--muted);
          }

          .contact-notes {
            font-size: 0.7rem;
            color: var(--dim);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .contact-status {
            font-size: 0.7rem;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 600;
            flex-shrink: 0;
          }

          .contact-status-warm {
            background: rgba(251,191,36,0.15);
            color: var(--amber);
          }

          .contact-status-cold {
            background: rgba(99,102,241,0.15);
            color: var(--primary-light);
          }
        </style>

        <div class="grid grid-1">
          <!-- Email Summary Header -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">\u{1F4E7} Communications Hub</span>
              <span class="badge badge-amber">Himalaya Setup Pending</span>
            </div>
            <div class="grid grid-4" style="gap: 20px;">
              <div class="email-metric">
                <div class="big-number text-red">${emailSummary.unread}</div>
                <div class="big-label">Unread Emails</div>
              </div>
              <div class="email-metric">
                <div class="big-number text-amber">${emailSummary.important}</div>
                <div class="big-label">Important</div>
              </div>
              <div class="email-metric">
                <div class="big-number text-blue">${emailSummary.flagged}</div>
                <div class="big-label">Flagged</div>
              </div>
              <div class="email-metric">
                <div class="sync-status">
                  <span class="status-dot status-pending"></span>
                  Last sync: ${api.formatTime(emailSummary.lastSync)}
                </div>
              </div>
            </div>
          </div>

          <!-- Outreach Status Overview -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">\u{1F4E1} Outreach Status</span>
              <span class="badge badge-green">${outreachStatus.responseRate} Response Rate</span>
            </div>
            <div class="outreach-status-grid">
              <div class="outreach-stat">
                <div class="outreach-stat-value text-blue">${outreachStatus.templatesAvailable}</div>
                <div class="outreach-stat-label">Templates Available</div>
              </div>
              <div class="outreach-stat">
                <div class="outreach-stat-value text-amber">${outreachStatus.warmProspects}</div>
                <div class="outreach-stat-label">Warm Prospects</div>
              </div>
              <div class="outreach-stat">
                <div class="outreach-stat-value text-blue">${outreachStatus.coldProspects}</div>
                <div class="outreach-stat-label">Cold Prospects</div>
              </div>
              <div class="outreach-stat">
                <div class="outreach-stat-value text-green">${outreachStatus.totalSent}</div>
                <div class="outreach-stat-label">Total Sent</div>
              </div>
            </div>
            <div class="outreach-status-grid" style="margin-top: 12px;">
              <div class="outreach-stat">
                <div class="outreach-stat-value text-amber">${outreachStatus.responseRate}</div>
                <div class="outreach-stat-label">Response Rate</div>
              </div>
              <div class="outreach-stat">
                <div class="outreach-stat-value text-green">${outreachStatus.meetingsBooked}</div>
                <div class="outreach-stat-label">Meetings Booked</div>
              </div>
              <div class="outreach-stat">
                <div class="outreach-stat-value text-green">${outreachStatus.converted}</div>
                <div class="outreach-stat-label">Converted</div>
              </div>
              <div class="outreach-stat">
                <div class="outreach-stat-value text-green">$185K</div>
                <div class="outreach-stat-label">Pipeline Value</div>
              </div>
            </div>
          </div>

          <!-- Pipeline Overview -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">\u{1F3AF} Outreach Pipeline</span>
              <span class="badge badge-green">${outreachPipeline.length} Active Leads</span>
            </div>
            <div class="pipeline-stages">
              ${Object.entries(stageStats).map(([stage, count]) => `
                <div class="pipeline-stage">
                  <div class="stage-header">
                    <span class="stage-name">${stage}</span>
                    <span class="stage-count">${count}</span>
                  </div>
                  <div class="stage-bar">
                    <div class="stage-fill stage-${stage.toLowerCase().replace(' ', '-')}"
                         style="width: ${(count / Math.max(...Object.values(stageStats))) * 100}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Key Contacts -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">\u{1F4CB} Key Contacts</span>
            </div>
            <div class="key-contacts-list">
              ${keyContacts.map(contact => `
                <div class="contact-item">
                  <div class="contact-avatar contact-avatar-${contact.status}">
                    ${contact.name.charAt(0)}
                  </div>
                  <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-role">${contact.role}</div>
                    <div class="contact-notes">${contact.notes}</div>
                  </div>
                  <span class="contact-status contact-status-${contact.status}">${contact.status}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Pipeline Details and Recent Messages -->
          <div class="grid grid-2">
            <!-- Outreach Pipeline Details -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">\u{1F465} Pipeline Details</span>
                <div class="pipeline-value">
                  Total Value: <span class="text-green font-bold">$185K</span>
                </div>
              </div>
              <div class="pipeline-list">
                ${outreachPipeline.map(lead => `
                  <div class="lead-item">
                    <div class="lead-header">
                      <div class="lead-name">${lead.name}</div>
                      <div class="lead-value">${lead.value}</div>
                    </div>
                    <div class="lead-company">${lead.company}</div>
                    <div class="lead-details">
                      <span class="lead-stage badge badge-${this.getStageColor(lead.stage)}">${lead.stage}</span>
                      <span class="lead-priority priority-${lead.priority}">${lead.priority} priority</span>
                    </div>
                    <div class="lead-notes">${lead.notes}</div>
                    <div class="lead-contact">
                      Last contact: ${api.formatDate(lead.lastContact + 'T00:00:00Z', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Recent Messages -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">\u{1F4AC} Recent Messages</span>
                <span class="badge badge-red">${recentMessages.filter(m => m.unread).length} Unread</span>
              </div>
              <div class="messages-list">
                ${recentMessages.map(message => `
                  <div class="message-item ${message.unread ? 'message-unread' : ''}">
                    <div class="message-header">
                      <div class="message-from">
                        <span class="message-type-icon">${this.getMessageTypeIcon(message.type)}</span>
                        ${message.from}
                      </div>
                      <div class="message-time">${message.time}</div>
                    </div>
                    <div class="message-subject">${message.subject}</div>
                    ${message.unread ? '<div class="unread-indicator"></div>' : ''}
                  </div>
                `).join('')}
              </div>
              <div class="message-actions">
                <button class="btn btn-secondary" disabled>
                  \u{1F4EC} Open Mail Client (Setup Required)
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">\u{26A1} Quick Actions</span>
            </div>
            <div class="grid grid-3" style="gap: 16px;">
              <button class="action-card" data-action="compose">
                <div class="action-icon">\u{1F4E7}</div>
                <div class="action-title">Compose Email</div>
                <div class="action-subtitle">Send new message</div>
              </button>
              <button class="action-card" data-action="add-lead">
                <div class="action-icon">\u{1F465}</div>
                <div class="action-title">Add Lead</div>
                <div class="action-subtitle">New outreach contact</div>
              </button>
              <button class="action-card" data-action="template">
                <div class="action-icon">\u{1F4DD}</div>
                <div class="action-title">Email Template</div>
                <div class="action-subtitle">Use saved template</div>
              </button>
            </div>
          </div>
        </div>
      `;

      this.setupEventListeners(container);

    } catch (error) {
      console.error('Failed to render communications page:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Communications Page Error</h2>
          <p>Failed to load communications data: ${error.message}</p>
          <button class="btn btn-primary" data-action="retry">Retry</button>
        </div>
      `;
      container.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="retry"]')) {
          location.reload();
        }
      });
    }
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['comms'] = CommsPage;
