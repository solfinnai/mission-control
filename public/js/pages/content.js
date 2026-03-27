/**
 * Content Calendar Page - Mission Control Content Management
 */
class ContentPage {
  constructor() {
    this.data = null;
  }

  async render(container, params = []) {
    try {
      // Load state data
      this.data = await api.getState();

      // Get current week dates
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
      });

      // Mock content data
      const draftQueue = [
        {
          id: 1,
          title: "AI Agents: The New Digital Workforce",
          platform: "LinkedIn",
          type: "Article",
          status: "Draft",
          dueDate: "2026-03-15",
          wordCount: 1200
        },
        {
          id: 2,
          title: "Building Executive Intelligence Systems",
          platform: "Twitter",
          type: "Thread",
          status: "Review",
          dueDate: "2026-03-13",
          wordCount: 280
        },
        {
          id: 3,
          title: "Kalshi Bot Performance Update",
          platform: "TikTok",
          type: "Video",
          status: "Script Ready",
          dueDate: "2026-03-14",
          wordCount: 150
        }
      ];

      const publishedLog = [
        {
          id: 1,
          title: "Why I'm Building an AI Army",
          platform: "LinkedIn",
          publishedDate: "2026-03-11",
          engagement: "2.3K views, 89 likes",
          link: "#"
        },
        {
          id: 2,
          title: "Breaking: $50K Revenue Target Update",
          platform: "Twitter",
          publishedDate: "2026-03-10",
          engagement: "1.1K views, 45 retweets",
          link: "#"
        },
        {
          id: 3,
          title: "Executive Intelligence Demo",
          platform: "TikTok",
          publishedDate: "2026-03-09",
          engagement: "5.2K views, 234 likes",
          link: "#"
        }
      ];

      const contentCalendar = {
        "2026-03-10": [{ title: "LinkedIn Post", platform: "LinkedIn", time: "9:00 AM" }],
        "2026-03-12": [{ title: "Twitter Thread", platform: "Twitter", time: "2:00 PM" }],
        "2026-03-13": [{ title: "TikTok Video", platform: "TikTok", time: "6:00 PM" }],
        "2026-03-15": [{ title: "LinkedIn Article", platform: "LinkedIn", time: "10:00 AM" }]
      };

      container.innerHTML = `
        <style data-page="content">
          .grid-7 {
            grid-template-columns: repeat(7, 1fr);
          }

          .content-day {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px;
            min-height: 120px;
          }

          .day-header {
            text-align: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
          }

          .day-name {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--primary-light);
          }

          .day-date {
            font-size: 1.2rem;
            font-weight: 700;
            margin-top: 2px;
          }

          .content-item {
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 6px;
            font-size: 0.75rem;
          }

          .content-platform {
            font-size: 0.8rem;
            margin-bottom: 2px;
          }

          .content-title {
            font-weight: 600;
            margin-bottom: 2px;
          }

          .content-time {
            color: var(--muted);
            font-size: 0.7rem;
          }

          .no-content {
            color: var(--dim);
            font-size: 0.75rem;
            text-align: center;
            padding: 8px;
          }

          .performance-metric {
            text-align: center;
          }

          .performance-change {
            font-size: 0.75rem;
            margin-top: 4px;
          }

          .text-green { color: var(--green); }
          .text-amber { color: var(--amber); }

          @media (max-width: 768px) {
            .grid-7 {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        </style>

        <div class="grid grid-1">
          <!-- Content Calendar Header -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">📅 Content Calendar</span>
              <span class="badge badge-green">Week of ${api.formatDate(weekDays[0].toISOString(), { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          <!-- Week View Grid -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">📊 Weekly Schedule</span>
              <span class="badge badge-blue">${Object.keys(contentCalendar).length} Scheduled</span>
            </div>
            <div class="grid grid-7" style="gap: 16px;">
              ${weekDays.map(day => {
                const dateKey = day.toISOString().split('T')[0];
                const dayContent = contentCalendar[dateKey] || [];
                const isToday = day.toDateString() === new Date().toDateString();

                return `
                  <div class="content-day ${isToday ? 'glow' : ''}">
                    <div class="day-header">
                      <div class="day-name">${day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div class="day-date">${day.getDate()}</div>
                    </div>
                    <div class="day-content">
                      ${dayContent.map(item => `
                        <div class="content-item content-${item.platform.toLowerCase()}">
                          <div class="content-platform">${this.getPlatformIcon(item.platform)}</div>
                          <div class="content-title">${item.title}</div>
                          <div class="content-time">${item.time}</div>
                        </div>
                      `).join('')}
                      ${dayContent.length === 0 ? '<div class="no-content">No posts scheduled</div>' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Draft Queue and Published Log -->
          <div class="grid grid-2">
            <!-- Draft Queue -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">📝 Draft Queue</span>
                <span class="badge badge-amber">${draftQueue.length} Drafts</span>
              </div>
              <div class="list-content">
                ${draftQueue.map(draft => `
                  <div class="list-item">
                    <div class="list-icon">${this.getPlatformIcon(draft.platform)}</div>
                    <div class="list-content">
                      <div class="list-title">${draft.title}</div>
                      <div class="list-subtitle">
                        ${draft.platform} • ${draft.type} • ${draft.wordCount} words • Due ${api.formatDate(draft.dueDate + 'T00:00:00Z', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <span class="badge badge-${this.getStatusColor(draft.status)}">${draft.status}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Published Log -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">🚀 Recent Published</span>
                <span class="badge badge-green">${publishedLog.length} This Week</span>
              </div>
              <div class="list-content">
                ${publishedLog.map(post => `
                  <div class="list-item cursor-pointer" data-published-link="${post.link}">
                    <div class="list-icon">${this.getPlatformIcon(post.platform)}</div>
                    <div class="list-content">
                      <div class="list-title">${post.title}</div>
                      <div class="list-subtitle">
                        ${post.platform} • ${api.formatDate(post.publishedDate + 'T00:00:00Z', { month: 'short', day: 'numeric' })} • ${post.engagement}
                      </div>
                    </div>
                    <span class="badge badge-cyan">Live</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Content Performance -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">📈 Content Performance</span>
              <span class="badge badge-blue">March 2026</span>
            </div>
            <div class="grid grid-3" style="gap: 24px;">
              <div class="performance-metric">
                <div class="big-number">8.6K</div>
                <div class="big-label">Total Views</div>
                <div class="performance-change text-green">+24% vs last week</div>
              </div>
              <div class="performance-metric">
                <div class="big-number">368</div>
                <div class="big-label">Engagements</div>
                <div class="performance-change text-green">+12% vs last week</div>
              </div>
              <div class="performance-metric">
                <div class="big-number">15</div>
                <div class="big-label">Posts Published</div>
                <div class="performance-change text-amber">Same as last week</div>
              </div>
            </div>
          </div>
        </div>
      `;

      this.setupEventListeners();

    } catch (error) {
      console.error('Failed to render content page:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Content Page Error</h2>
          <p>Failed to load content data: ${error.message}</p>
          <button class="btn btn-primary" data-action="retry">Retry</button>
        </div>
      `;
      this.setupEventListeners();
    }
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }

  getPlatformIcon(platform) {
    const icons = {
      'LinkedIn': '💼',
      'Twitter': '🐦',
      'TikTok': '🎵',
      'Instagram': '📸',
      'YouTube': '📺'
    };
    return icons[platform] || '📱';
  }

  getStatusColor(status) {
    const colors = {
      'Draft': 'amber',
      'Review': 'blue',
      'Script Ready': 'cyan',
      'Approved': 'green',
      'Scheduled': 'green'
    };
    return colors[status] || 'amber';
  }

  setupEventListeners() {
    // Published post links - open in new tab
    document.querySelectorAll('[data-published-link]').forEach(item => {
      item.addEventListener('click', (e) => {
        const link = item.getAttribute('data-published-link');
        if (link && link !== '#') {
          window.open(link, '_blank');
        }
      });
    });

    // Retry button on error state
    document.querySelectorAll('[data-action="retry"]').forEach(btn => {
      btn.addEventListener('click', () => {
        location.reload();
      });
    });
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['content'] = ContentPage;
