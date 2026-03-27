/**
 * Projects Page - Dynamic Project Grid & Detail Views
 */
class ProjectsPage {
  constructor() {
    this.projects = null;
    this.currentProject = null;
    this.currentFilter = 'All';
    this.currentSort = 'priority';
  }

  async render(container, params = []) {
    try {
      this.projects = await api.getProjects();

      // Check if we're viewing a specific project
      if (params.length > 0) {
        await this.renderProjectDetail(container, params[0]);
      } else {
        await this.renderProjectGrid(container);
      }

    } catch (error) {
      console.error('Failed to render projects:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Projects Error</h2>
          <p>Failed to load projects data: ${error.message}</p>
          <button class="btn btn-primary" onclick="app.navigate('dashboard')">Back to Dashboard</button>
        </div>
      `;
    }
  }

  async renderProjectGrid(container) {
    const projectList = this.getProjectList();
    const filteredProjects = this.filterProjects(projectList);
    const sortedProjects = this.sortProjects(filteredProjects);

    container.innerHTML = `
      <!-- Header Controls -->
      <div class="flex" style="justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1>Projects</h1>
          <p class="text-muted">${sortedProjects.length} active projects</p>
        </div>
        <div class="flex" style="gap: 12px; align-items: center;">
          <select id="sort-select" class="form-select">
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
            <option value="updated">Sort by Last Updated</option>
            <option value="revenue">Sort by Revenue</option>
          </select>
          <button class="btn btn-primary" onclick="app.navigate('projects/new')">+ New Project</button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="filter-tabs" style="margin-bottom: 32px;">
        ${this.renderFilterTabs()}
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-3" id="projects-grid">
        ${sortedProjects.map(project => this.renderProjectCard(project)).join('')}
      </div>

      <style>
      .filter-tabs {
        display: flex;
        gap: 8px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 8px;
      }
      .filter-tab {
        padding: 8px 16px;
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s;
      }
      .filter-tab:hover {
        background: rgba(255,255,255,0.05);
        color: var(--text);
      }
      .filter-tab.active {
        background: var(--primary);
        color: white;
      }
      .project-card {
        transition: all 0.2s ease;
      }
      .project-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      }
      .health-indicator {
        font-size: 1.2em;
        margin-right: 8px;
      }
      </style>
    `;

    this.setupGridEventListeners();
  }

  async renderProjectDetail(container, projectId) {
    const project = this.projects[projectId];
    if (!project) {
      container.innerHTML = `
        <div class="card">
          <h2>Project Not Found</h2>
          <p>Project "${projectId}" was not found.</p>
          <button class="btn btn-primary" onclick="app.navigate('projects')">Back to Projects</button>
        </div>
      `;
      return;
    }

    this.currentProject = { id: projectId, ...project };
    const content = project.type === 'file' ? project.content : (project.files['README.md'] || '');
    const parsedProject = this.parseProjectMarkdown(content);

    container.innerHTML = `
      <!-- Header -->
      <div class="flex" style="justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <div class="flex" style="align-items: center; gap: 12px; margin-bottom: 8px;">
            <h1>${parsedProject.name || this.getProjectDisplayName(projectId)}</h1>
            ${this.renderStatusBadge(parsedProject.status?.phase)}
            ${this.renderPriorityBadge(parsedProject.status?.priority)}
            ${this.renderHealthIndicator(parsedProject.status?.health)}
          </div>
          <p class="text-muted" style="font-size: 1.1rem; margin: 0;">${parsedProject.tagline || ''}</p>
        </div>
        <div class="flex" style="gap: 12px;">
          <button class="btn btn-secondary" onclick="app.navigate('projects')">
            ← Back to Projects
          </button>
          ${this.renderProjectActionButton(parsedProject.status?.url)}
        </div>
      </div>

      <div class="grid grid-3" style="gap: 24px;">
        <!-- Main Content -->
        <div class="col-span-2">
          ${this.renderOverviewSection(parsedProject.overview)}
          ${this.renderRoadmapSection(parsedProject.roadmap)}
          ${this.renderCriticalPathSection(parsedProject.criticalPath)}
          ${this.renderTodosSection(parsedProject.todos)}
        </div>

        <!-- Sidebar -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${this.renderProjectStatusCard(parsedProject.status)}
          ${this.renderScheduleSection(parsedProject.schedule)}
          ${this.renderMetricsSection(parsedProject.metrics)}
        </div>
      </div>

      <!-- Full Width Sections -->
      <div style="margin-top: 32px;">
        ${this.renderMentalitySection(parsedProject.mentality)}
        ${this.renderResourcesSection(parsedProject.resources)}
      </div>

      <style>
      .roadmap-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .roadmap-status {
        width: 80px;
        margin-right: 16px;
      }
      .roadmap-content {
        flex: 1;
      }
      .roadmap-date {
        color: var(--muted);
        font-size: 0.9rem;
        margin-left: 16px;
      }
      .critical-path {
        counter-reset: step-counter;
      }
      .critical-step {
        counter-increment: step-counter;
        display: flex;
        align-items: flex-start;
        margin: 16px 0;
      }
      .critical-step::before {
        content: counter(step-counter);
        background: var(--primary);
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
        margin-right: 16px;
        flex-shrink: 0;
      }
      .todo-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
      }
      .todo-checkbox {
        width: 16px;
        height: 16px;
        border: 2px solid var(--border);
        border-radius: 4px;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
      }
      .todo-completed {
        background: var(--primary);
        border-color: var(--primary);
      }
      .todo-completed + span {
        opacity: 0.6;
        text-decoration: line-through;
      }
      .mentality-section {
        background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1));
        border: 1px solid rgba(79, 70, 229, 0.2);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }
      .metric-card {
        text-align: center;
        padding: 16px;
        background: rgba(255,255,255,0.02);
        border-radius: 8px;
      }
      .metric-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--primary);
      }
      .metric-label {
        font-size: 0.85rem;
        color: var(--muted);
        margin-top: 4px;
      }
      .metric-target {
        font-size: 0.8rem;
        color: var(--muted);
        opacity: 0.7;
      }
      </style>
    `;

    this.setupDetailEventListeners();
  }

  parseProjectMarkdown(content) {
    if (!content) return {};
    
    const sections = {};
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        sections.name = line.substring(2).trim();
      } else if (line.startsWith('> ')) {
        sections.tagline = line.substring(2).trim();
      } else if (line.startsWith('## ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.substring(3).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }
    
    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    // Parse status section
    if (sections.status) {
      sections.status = this.parseStatusSection(sections.status);
    }

    // Parse roadmap table
    if (sections.roadmap) {
      sections.roadmap = this.parseTableSection(sections.roadmap);
    }

    // Parse schedule table  
    if (sections.schedule) {
      sections.schedule = this.parseTableSection(sections.schedule);
    }

    // Parse metrics table
    if (sections.keymetrics) {
      sections.metrics = this.parseTableSection(sections.keymetrics);
    }

    // Parse critical path list
    if (sections.criticalpathtosucess) {
      sections.criticalPath = this.parseListSection(sections.criticalpathtosucess);
    }

    // Parse todos list
    if (sections.todos) {
      sections.todos = this.parseTodoSection(sections.todos);
    }

    // Parse resources list
    if (sections.resourceslinks) {
      sections.resources = this.parseResourcesSection(sections.resourceslinks);
    }

    return sections;
  }

  parseStatusSection(content) {
    const status = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.includes('**Phase:**')) {
        status.phase = line.split('**Phase:**')[1].trim();
      } else if (line.includes('**Priority:**')) {
        status.priority = line.split('**Priority:**')[1].trim();
      } else if (line.includes('**Health:**')) {
        status.health = line.split('**Health:**')[1].trim();
      } else if (line.includes('**Category:**')) {
        status.category = line.split('**Category:**')[1].trim();
      } else if (line.includes('**URL:**')) {
        status.url = line.split('**URL:**')[1].trim();
      } else if (line.includes('**Revenue Model:**')) {
        status.revenueModel = line.split('**Revenue Model:**')[1].trim();
      } else if (line.includes('**Monthly Revenue:**')) {
        status.monthlyRevenue = line.split('**Monthly Revenue:**')[1].trim();
      }
    }
    
    return status;
  }

  parseTableSection(content) {
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('|---'));
    if (lines.length < 2) return [];
    
    const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
    const rows = lines.slice(1).map(line => {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      const row = {};
      headers.forEach((header, index) => {
        row[header.toLowerCase().replace(/\s+/g, '')] = cells[index] || '';
      });
      return row;
    });
    
    return { headers, rows };
  }

  parseListSection(content) {
    return content.split('\n')
      .filter(line => line.trim() && line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
  }

  parseTodoSection(content) {
    return content.split('\n')
      .filter(line => line.trim() && line.match(/^- \[/))
      .map(line => {
        const completed = line.includes('[x]');
        const text = line.replace(/^- \[(x| )\]\s*/, '').trim();
        return { completed, text };
      });
  }

  parseResourcesSection(content) {
    return content.split('\n')
      .filter(line => line.trim() && line.startsWith('-'))
      .map(line => {
        const match = line.match(/- \[([^\]]+)\]\(([^)]+)\)/);
        return match ? { text: match[1], url: match[2] } : { text: line.substring(1).trim(), url: null };
      });
  }

  getProjectList() {
    if (!this.projects) return [];

    return Object.keys(this.projects)
      .filter(key => this.projects[key])
      .map(key => {
        const project = this.projects[key];
        const content = project.type === 'file' ? project.content : (project.files['README.md'] || '');
        const parsed = this.parseProjectMarkdown(content);
        
        return {
          id: key,
          name: parsed.name || this.getProjectDisplayName(key),
          description: parsed.tagline || 'No description available',
          icon: this.getProjectIcon(key, parsed.status?.category),
          status: parsed.status?.phase || 'Unknown',
          priority: parsed.status?.priority || 'Medium',
          health: parsed.status?.health || '🟡 Needs Attention',
          category: parsed.status?.category || 'General',
          monthlyRevenue: parsed.status?.monthlyRevenue || '$0',
          url: parsed.status?.url || null
        };
      });
  }

  getProjectIcon(projectId, category) {
    const icons = {
      'executive-intelligence': '🧠',
      'soakatlas': '♨️',
      'gk-labs': '🏗️',
      'oni-force': '⛩️',
      'prediction-markets': '📊',
      'content-funnel-engine': '📱',
      'linkedin-reactivation': '💼',
      'game-of-life': '🎯',
      'vitalog': '💚',
      'client-early-life-psych': '👶',
      'client-simplicity-media': '📺'
    };

    const categoryIcons = {
      'Business': '💼',
      'Trading': '📊',
      'Growth': '📈',
      'Product': '📦',
      'Client': '👥'
    };

    return icons[projectId] || categoryIcons[category] || '📁';
  }

  filterProjects(projects) {
    if (this.currentFilter === 'All') return projects;
    return projects.filter(p => p.category === this.currentFilter);
  }

  sortProjects(projects) {
    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const statusOrder = { 'Live': 5, 'Development': 4, 'Research': 3, 'Idea': 2, 'Blocked': 1 };

    return [...projects].sort((a, b) => {
      switch (this.currentSort) {
        case 'priority':
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        case 'status':
          return (statusOrder[b.status] || 2) - (statusOrder[a.status] || 2);
        case 'revenue':
          const aRevenue = parseFloat(a.monthlyRevenue.replace(/[$,]/g, '')) || 0;
          const bRevenue = parseFloat(b.monthlyRevenue.replace(/[$,]/g, '')) || 0;
          return bRevenue - aRevenue;
        case 'updated':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }

  renderFilterTabs() {
    const categories = ['All', 'Business', 'Trading', 'Growth', 'Product', 'Client'];
    return categories.map(cat => 
      `<button class="filter-tab ${cat === this.currentFilter ? 'active' : ''}" 
               data-category="${cat}">${cat}</button>`
    ).join('');
  }

  renderProjectCard(project) {
    const statusColors = {
      'Live': 'green', 'Development': 'amber', 'Research': 'blue', 
      'Idea': 'blue', 'Blocked': 'red', 'Active': 'green'
    };

    const priorityColors = {
      'Critical': 'red', 'High': 'amber', 'Medium': 'blue', 'Low': 'green'
    };

    return `
      <div class="card cursor-pointer project-card" data-project-id="${project.id}">
        <div class="card-header">
          <div class="flex" style="align-items: center; gap: 12px; margin-bottom: 8px;">
            <span class="text-2xl">${project.icon}</span>
            <div style="flex: 1;">
              <div class="card-title" style="font-size: 1rem; margin-bottom: 4px;">${project.name}</div>
              <div class="flex" style="gap: 8px; align-items: center;">
                <span class="badge badge-${statusColors[project.status] || 'blue'}">${project.status}</span>
                <span class="badge badge-${priorityColors[project.priority] || 'blue'} text-xs">${project.priority}</span>
              </div>
            </div>
          </div>
          <div class="flex" style="justify-content: space-between; align-items: center;">
            <span class="health-indicator">${project.health.split(' ')[0]}</span>
            <span class="text-xs text-muted">${project.category}</span>
          </div>
        </div>

        <div class="card-content">
          <p class="text-muted" style="font-size: 0.9rem; line-height: 1.4; margin: 12px 0;">
            ${project.description}
          </p>
          
          <div class="flex" style="justify-content: space-between; align-items: center; margin-top: 16px;">
            <span class="text-xs font-semibold" style="color: var(--primary);">${project.monthlyRevenue}</span>
            <span class="text-xs text-muted">Click to view →</span>
          </div>
        </div>
      </div>
    `;
  }

  renderStatusBadge(phase) {
    const colors = {
      'Live': 'green', 'Development': 'amber', 'Research': 'blue',
      'Idea': 'blue', 'Blocked': 'red', 'Active': 'green'
    };
    return `<span class="badge badge-${colors[phase] || 'blue'}">${phase || 'Unknown'}</span>`;
  }

  renderPriorityBadge(priority) {
    const colors = { 'Critical': 'red', 'High': 'amber', 'Medium': 'blue', 'Low': 'green' };
    return `<span class="badge badge-${colors[priority] || 'blue'}">${priority || 'Medium'}</span>`;
  }

  renderHealthIndicator(health) {
    return `<span class="health-indicator" title="${health}">${(health || '🟡 Needs Attention').split(' ')[0]}</span>`;
  }

  renderProjectActionButton(url) {
    if (url && url !== 'N/A' && url !== 'Coming Soon') {
      return `<a href="${url}" target="_blank" class="btn btn-primary">View Site →</a>`;
    }
    return `<button class="btn btn-primary" onclick="app.navigate('tasks')">View Tasks</button>`;
  }

  renderOverviewSection(overview) {
    return overview ? `
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">📋 Overview</span>
        </div>
        <div class="card-content">
          <div class="content-markdown">${api.parseMarkdown(overview)}</div>
        </div>
      </div>
    ` : '';
  }

  renderRoadmapSection(roadmap) {
    if (!roadmap || !roadmap.rows) return '';

    return `
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">🗺️ Roadmap</span>
        </div>
        <div class="card-content">
          <div class="roadmap-timeline">
            ${roadmap.rows.map(row => `
              <div class="roadmap-item">
                <div class="roadmap-status">${this.renderRoadmapStatus(row.status)}</div>
                <div class="roadmap-content">
                  <div class="font-semibold">${row.phase}. ${row.description}</div>
                </div>
                <div class="roadmap-date">${row.targetdate || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderRoadmapStatus(status) {
    if (status?.includes('✅') || status?.includes('Done')) return '<span style="color: var(--success);">✅ Done</span>';
    if (status?.includes('🔧') || status?.includes('Progress')) return '<span style="color: var(--warning);">🔧 Active</span>';
    if (status?.includes('⏳') || status?.includes('Queued')) return '<span style="color: var(--muted);">⏳ Queued</span>';
    return status || '';
  }

  renderCriticalPathSection(criticalPath) {
    if (!criticalPath || !criticalPath.length) return '';

    return `
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">🎯 Critical Path to Success</span>
        </div>
        <div class="card-content">
          <div class="critical-path">
            ${criticalPath.map(step => `
              <div class="critical-step">
                <div>${step}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderTodosSection(todos) {
    if (!todos || !todos.length) return '';

    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;

    return `
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">✅ To-Dos</span>
          <span class="badge badge-blue">${completed}/${total} completed</span>
        </div>
        <div class="card-content">
          ${todos.map(todo => `
            <div class="todo-item">
              <div class="todo-checkbox ${todo.completed ? 'todo-completed' : ''}">
                ${todo.completed ? '✓' : ''}
              </div>
              <span>${todo.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderProjectStatusCard(status) {
    if (!status) return '';

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Project Status</span>
        </div>
        <div class="card-content">
          <div class="stats-list">
            ${status.phase ? `<div class="list-item"><span>Phase:</span><span class="font-semibold">${status.phase}</span></div>` : ''}
            ${status.priority ? `<div class="list-item"><span>Priority:</span><span class="font-semibold">${status.priority}</span></div>` : ''}
            ${status.health ? `<div class="list-item"><span>Health:</span><span class="font-semibold">${status.health}</span></div>` : ''}
            ${status.category ? `<div class="list-item"><span>Category:</span><span class="font-semibold">${status.category}</span></div>` : ''}
            ${status.monthlyRevenue ? `<div class="list-item"><span>Monthly Revenue:</span><span class="font-semibold">${status.monthlyRevenue}</span></div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  renderScheduleSection(schedule) {
    if (!schedule || !schedule.rows) return '';

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">📅 Schedule</span>
        </div>
        <div class="card-content">
          <table class="table">
            <thead>
              <tr>
                ${schedule.headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${schedule.rows.map(row => `
                <tr>
                  ${schedule.headers.map(h => `<td>${row[h.toLowerCase().replace(/\s+/g, '')] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderMetricsSection(metrics) {
    if (!metrics || !metrics.rows) return '';

    return `
      <div class="card" style="margin-top: 24px;">
        <div class="card-header">
          <span class="card-title">📈 Key Metrics</span>
        </div>
        <div class="card-content">
          <div class="metrics-grid">
            ${metrics.rows.map(row => `
              <div class="metric-card">
                <div class="metric-value">${row.current || '—'}</div>
                <div class="metric-label">${row.metric || ''}</div>
                ${row.target ? `<div class="metric-target">Target: ${row.target}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderMentalitySection(mentality) {
    return mentality ? `
      <div class="mentality-section">
        <h3 style="margin: 0 0 16px 0; color: var(--text);">🧠 Mentality & Strategy</h3>
        <div class="content-markdown">${api.parseMarkdown(mentality)}</div>
      </div>
    ` : '';
  }

  renderResourcesSection(resources) {
    if (!resources || !resources.length) return '';

    return `
      <div class="card" style="margin-top: 24px;">
        <div class="card-header">
          <span class="card-title">🔗 Resources & Links</span>
        </div>
        <div class="card-content">
          <div class="grid grid-2" style="gap: 12px;">
            ${resources.map(resource => `
              <div class="list-item">
                ${resource.url ? `
                  <a href="${resource.url}" target="_blank" class="list-content" style="text-decoration: none;">
                    <div class="list-title">${resource.text}</div>
                    <div class="list-subtitle">${resource.url}</div>
                  </a>
                ` : `
                  <div class="list-content">
                    <div class="list-title">${resource.text}</div>
                  </div>
                `}
                ${resource.url ? '<div class="list-meta">↗️</div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  getProjectDisplayName(projectId) {
    const names = {
      'executive-intelligence': 'Executive Intelligence',
      'soakatlas': 'SoakAtlas',
      'gk-labs': 'GK Labs',
      'oni-force': 'ONI Force',
      'prediction-markets': 'Prediction Markets',
      'content-funnel-engine': 'Content Funnel Engine',
      'linkedin-reactivation': 'LinkedIn Reactivation',
      'game-of-life': 'Game of Life',
      'vitalog': 'Vitalog',
      'client-early-life-psych': 'Early Life Psychology',
      'client-simplicity-media': 'Simplicity Media'
    };

    return names[projectId] || projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  setupGridEventListeners() {
    // Project card clicks
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.dataset.projectId;
        app.navigate(`projects/${projectId}`);
      });
    });

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentFilter = tab.dataset.category;
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.render(document.getElementById('content-area'), []);
      });
    });

    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.value = this.currentSort;
      sortSelect.addEventListener('change', () => {
        this.currentSort = sortSelect.value;
        this.render(document.getElementById('content-area'), []);
      });
    }
  }

  setupDetailEventListeners() {
    // Additional interactions can be added here
  }

  async refresh() {
    console.log('🔄 Refreshing projects...');
    const container = document.getElementById('content-area');
    this.projects = null; // Clear cache
    await this.render(container, this.currentProject ? [this.currentProject.id] : []);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['projects'] = ProjectsPage;