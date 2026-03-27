/**
 * Tasks Page - Kanban-style Task Management
 */
class TasksPage {
  constructor() {
    this.tasks = [];
    this.data = null;
  }

  async render(container, params = []) {
    try {
      this.data = await api.getState();
      this.tasks = await this.extractAllTasks();

      container.innerHTML = `
        <!-- Task Board Header -->
        <div class="flex" style="justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h1>📋 Task Board</h1>
            <div class="flex" style="gap: 16px; margin-top: 8px;">
              <span class="badge badge-blue">${this.tasks.length} Total Tasks</span>
              <span class="badge badge-amber">${this.getTasksByStatus('in-progress').length} In Progress</span>
              <span class="badge badge-green">${this.getTasksByStatus('done').length} Completed</span>
            </div>
          </div>
          <div class="flex" style="gap: 12px;">
            <button class="btn btn-secondary" onclick="window._tasksPage.filterTasks('all')">All</button>
            <button class="btn btn-secondary" onclick="window._tasksPage.filterTasks('henry')">Henry</button>
            <button class="btn btn-secondary" onclick="window._tasksPage.filterTasks('sol')">Sol</button>
            <button class="btn btn-secondary" onclick="window._tasksPage.filterTasks('sonnet')">Sonnet</button>
            <button class="btn btn-secondary" onclick="window._tasksPage.filterTasks('codex')">Codex</button>
          </div>
        </div>

        <!-- Kanban Board -->
        <div class="kanban-board">
          <div class="kanban-column">
            <div class="kanban-header">
              <h3>📝 Backlog</h3>
              <span class="badge badge-blue">${this.getTasksByStatus('backlog').length}</span>
            </div>
            <div class="kanban-content" id="backlog-tasks">
              ${this.renderTasksByStatus('backlog')}
            </div>
          </div>

          <div class="kanban-column">
            <div class="kanban-header">
              <h3>🚀 In Progress</h3>
              <span class="badge badge-amber">${this.getTasksByStatus('in-progress').length}</span>
            </div>
            <div class="kanban-content" id="in-progress-tasks">
              ${this.renderTasksByStatus('in-progress')}
            </div>
          </div>

          <div class="kanban-column">
            <div class="kanban-header">
              <h3>✅ Done</h3>
              <span class="badge badge-green">${this.getTasksByStatus('done').length}</span>
            </div>
            <div class="kanban-content" id="done-tasks">
              ${this.renderTasksByStatus('done')}
            </div>
          </div>

          <div class="kanban-column">
            <div class="kanban-header">
              <h3>🚫 Blocked</h3>
              <span class="badge badge-red">${this.getTasksByStatus('blocked').length}</span>
            </div>
            <div class="kanban-content" id="blocked-tasks">
              ${this.renderTasksByStatus('blocked')}
            </div>
          </div>
        </div>

        <!-- Task Summary Cards -->
        <div class="grid grid-3" style="margin-top: 32px;">
          <div class="card">
            <div class="card-header">
              <span class="card-title">👤 Task Assignment</span>
            </div>
            ${this.renderTaskAssignment()}
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">📊 Project Breakdown</span>
            </div>
            ${this.renderProjectBreakdown()}
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">🎯 Priority Analysis</span>
            </div>
            ${this.renderPriorityAnalysis()}
          </div>
        </div>

        <style>
        .kanban-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .kanban-column {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          min-height: 500px;
        }

        .kanban-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }

        .kanban-header h3 {
          font-size: 1rem;
          margin: 0;
        }

        .kanban-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          cursor: grab;
          transition: all 0.2s ease;
        }

        .task-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
        }

        .task-card:active {
          cursor: grabbing;
        }

        .task-title {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          font-size: 0.75rem;
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .task-priority-high { border-left: 4px solid var(--red); }
        .task-priority-medium { border-left: 4px solid var(--amber); }
        .task-priority-low { border-left: 4px solid var(--green); }

        @media (max-width: 1200px) {
          .kanban-board {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .kanban-board {
            grid-template-columns: 1fr;
          }
        }
        </style>
      `;

      this.setupEventListeners();

    } catch (error) {
      console.error('Failed to render tasks:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Tasks Error</h2>
          <p>Failed to load task data: ${error.message}</p>
          <button class="btn btn-primary" onclick="app.navigate('dashboard')">Back to Dashboard</button>
        </div>
      `;
    }
  }

  async extractAllTasks() {
    const tasks = [];

    // Extract from daily notes
    if (this.data?.dailyNotes) {
      const dailyTasks = api.extractTasks(this.data.dailyNotes);
      tasks.push(...dailyTasks.map(task => ({
        ...task,
        source: 'daily-notes',
        assignee: this.inferAssignee(task.text),
        priority: this.inferPriority(task.text),
        project: this.inferProject(task.text),
        status: task.completed ? 'done' : 'in-progress'
      })));
    }

    // Extract from mission control
    if (this.data?.missionControl) {
      const missionTasks = api.extractTasks(this.data.missionControl);
      tasks.push(...missionTasks.map(task => ({
        ...task,
        source: 'mission-control',
        assignee: this.inferAssignee(task.text),
        priority: this.inferPriority(task.text),
        project: this.inferProject(task.text),
        status: task.completed ? 'done' : 'backlog'
      })));
    }

    // Extract from project files
    if (this.data?.projects) {
      Object.entries(this.data.projects).forEach(([projectId, project]) => {
        const projectContent = project.content || project.files?.['README.md'] || '';
        const projectTasks = api.extractTasks(projectContent);
        tasks.push(...projectTasks.map(task => ({
          ...task,
          source: projectId,
          assignee: this.inferAssignee(task.text),
          priority: this.inferPriority(task.text),
          project: projectId,
          status: task.completed ? 'done' : this.inferStatus(task.text)
        })));
      });
    }

    // Add some mock tasks for demonstration
    tasks.push(
      {
        id: 'mock-1',
        text: 'Build Kalshi trading bot MVP',
        assignee: 'codex',
        priority: 'high',
        project: 'kalshi-bot',
        status: 'backlog',
        source: 'mock'
      },
      {
        id: 'mock-2',
        text: 'Write first LinkedIn post for content engine',
        assignee: 'sonnet',
        priority: 'high',
        project: 'content-engine',
        status: 'in-progress',
        source: 'mock'
      },
      {
        id: 'mock-3',
        text: 'Set up DNS for Executive Intelligence domain',
        assignee: 'henry',
        priority: 'medium',
        project: 'executive-intelligence',
        status: 'blocked',
        source: 'mock'
      }
    );

    return tasks;
  }

  inferAssignee(taskText) {
    const text = taskText.toLowerCase();
    if (text.includes('build') || text.includes('code') || text.includes('bot')) return 'codex';
    if (text.includes('write') || text.includes('content') || text.includes('post')) return 'sonnet';
    if (text.includes('henry') || text.includes('ceo') || text.includes('decide')) return 'henry';
    return 'sol';
  }

  inferPriority(taskText) {
    const text = taskText.toLowerCase();
    if (text.includes('urgent') || text.includes('critical') || text.includes('asap')) return 'high';
    if (text.includes('important') || text.includes('priority')) return 'high';
    if (text.includes('minor') || text.includes('nice to have')) return 'low';
    return 'medium';
  }

  inferProject(taskText) {
    const text = taskText.toLowerCase();
    if (text.includes('kalshi') || text.includes('trading')) return 'kalshi-bot';
    if (text.includes('linkedin') || text.includes('content')) return 'content-engine';
    if (text.includes('executive') || text.includes('intelligence')) return 'executive-intelligence';
    if (text.includes('0n1') || text.includes('oni')) return 'oni-force';
    return 'general';
  }

  inferStatus(taskText) {
    const text = taskText.toLowerCase();
    if (text.includes('blocked') || text.includes('waiting')) return 'blocked';
    if (text.includes('in progress') || text.includes('working')) return 'in-progress';
    return 'backlog';
  }

  getTasksByStatus(status) {
    return this.tasks.filter(task => task.status === status);
  }

  renderTasksByStatus(status) {
    const tasks = this.getTasksByStatus(status);

    if (tasks.length === 0) {
      return `<div class="text-center text-muted" style="padding: 20px;">No ${status} tasks</div>`;
    }

    return tasks.map(task => this.renderTaskCard(task)).join('');
  }

  renderTaskCard(task) {
    const assigneeInfo = this.getAssigneeInfo(task.assignee);

    return `
      <div class="task-card task-priority-${task.priority}" data-task-id="${task.id}">
        <div class="task-title">${task.text}</div>

        <div class="task-meta">
          <div class="task-assignee">
            <span>${assigneeInfo.icon}</span>
            <span>${assigneeInfo.name}</span>
          </div>
          <div class="flex" style="gap: 6px; align-items: center;">
            <span class="badge badge-${this.getPriorityColor(task.priority)} text-xs">${task.priority}</span>
            ${task.project !== 'general' ? `<span class="badge badge-blue text-xs">${task.project}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  getAssigneeInfo(assignee) {
    const assigneeMap = {
      'henry': { name: 'Henry', icon: '👨‍💼' },
      'sol': { name: 'Sol', icon: '☀️' },
      'sonnet': { name: 'Sonnet', icon: '✍️' },
      'codex': { name: 'Codex', icon: '⚡' }
    };

    return assigneeMap[assignee] || { name: 'Unassigned', icon: '👤' };
  }

  getPriorityColor(priority) {
    const colors = {
      'high': 'red',
      'medium': 'amber',
      'low': 'green'
    };
    return colors[priority] || 'blue';
  }

  renderTaskAssignment() {
    const assigneeCounts = {
      'henry': this.tasks.filter(t => t.assignee === 'henry').length,
      'sol': this.tasks.filter(t => t.assignee === 'sol').length,
      'sonnet': this.tasks.filter(t => t.assignee === 'sonnet').length,
      'codex': this.tasks.filter(t => t.assignee === 'codex').length
    };

    return Object.entries(assigneeCounts).map(([assignee, count]) => {
      const info = this.getAssigneeInfo(assignee);
      return `
        <div class="list-item">
          <div class="list-icon">${info.icon}</div>
          <div class="list-content">
            <div class="list-title">${info.name}</div>
            <div class="list-subtitle">${count} tasks assigned</div>
          </div>
          <div class="list-meta font-bold">${count}</div>
        </div>
      `;
    }).join('');
  }

  renderProjectBreakdown() {
    const projectCounts = {};
    this.tasks.forEach(task => {
      projectCounts[task.project] = (projectCounts[task.project] || 0) + 1;
    });

    return Object.entries(projectCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([project, count]) => `
        <div class="list-item">
          <div class="list-content">
            <div class="list-title">${project.replace(/-/g, ' ')}</div>
            <div class="list-subtitle">${count} task${count > 1 ? 's' : ''}</div>
          </div>
          <div class="list-meta font-bold">${count}</div>
        </div>
      `).join('');
  }

  renderPriorityAnalysis() {
    const priorityCounts = {
      'high': this.tasks.filter(t => t.priority === 'high').length,
      'medium': this.tasks.filter(t => t.priority === 'medium').length,
      'low': this.tasks.filter(t => t.priority === 'low').length
    };

    return Object.entries(priorityCounts).map(([priority, count]) => `
      <div class="list-item">
        <div class="list-content">
          <div class="list-title">${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</div>
          <div class="list-subtitle">${count} task${count > 1 ? 's' : ''}</div>
        </div>
        <div class="list-meta">
          <span class="badge badge-${this.getPriorityColor(priority)}">${count}</span>
        </div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    window._tasksPage = this;

    // Add filter functionality
    this.filterTasks = (filter) => {
      console.log('Filter tasks by:', filter);
      // Implementation for filtering tasks
    };

    // Add drag and drop functionality for task cards
    document.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.dataset.taskId);
      });
    });

    document.querySelectorAll('.kanban-content').forEach(column => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        console.log('Task moved:', taskId, 'to column:', column.id);
        // Implementation for moving tasks between columns
      });
    });
  }

  async refresh() {
    console.log('🔄 Refreshing tasks...');
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['tasks'] = TasksPage;