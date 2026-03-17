/**
 * Finances Page - Revenue Dashboard
 */
class FinancesPage {
  constructor() {
    this.data = null;
  }

  async render(container, params = []) {
    try {
      this.data = await api.getState();

      container.innerHTML = `
        <div class="grid grid-3">
          <!-- Revenue Overview -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">💰 Total Revenue</span>
            </div>
            <div class="big-number">$${this.getTotalRevenue()}</div>
            <div class="big-label">Month to Date</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">📈 Growth Rate</span>
            </div>
            <div class="big-number">∞%</div>
            <div class="big-label">vs Last Month</div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">🎯 Target Progress</span>
            </div>
            <div class="big-number">${this.getTargetProgress()}%</div>
            <div class="big-label">To $50K Goal</div>
          </div>

          <!-- Revenue Targets -->
          <div class="card col-span-3">
            <div class="card-header">
              <span class="card-title">🎯 Financial Targets</span>
              <span class="badge badge-red">Day ${this.getDaysSinceStart()}</span>
            </div>
            ${this.renderFinancialTargets()}
          </div>

          <!-- Revenue Breakdown -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">💼 Revenue Sources</span>
            </div>
            ${this.renderRevenueBreakdown()}
          </div>

          <!-- Cash Flow -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">💸 Cash Flow</span>
            </div>
            ${this.renderCashFlow()}
          </div>

          <!-- Financial Targets Table -->
          <div class="card col-span-3">
            <div class="card-header">
              <span class="card-title">📊 Detailed Targets</span>
            </div>
            ${this.renderTargetsTable()}
          </div>
        </div>
      `;

    } catch (error) {
      console.error('Failed to render finances:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Finances Error</h2>
          <p>Failed to load financial data: ${error.message}</p>
          <button class="btn btn-primary" onclick="app.navigate('dashboard')">Back to Dashboard</button>
        </div>
      `;
    }
  }

  getTotalRevenue() {
    // Extract from trading state or other sources
    if (this.data?.tradingState?.totalPnL) {
      return Math.max(0, this.data.tradingState.totalPnL).toLocaleString();
    }
    return '0';
  }

  getTargetProgress() {
    const revenue = parseInt(this.getTotalRevenue().replace(/,/g, ''));
    return Math.round((revenue / 50000) * 100);
  }

  getDaysSinceStart() {
    const startDate = new Date('2026-03-12');
    const today = new Date();
    const diffTime = today - startDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  renderFinancialTargets() {
    const targets = [
      {
        label: 'Urgent Fund ($50K by Apr 12)',
        current: parseInt(this.getTotalRevenue().replace(/,/g, '')),
        target: 50000,
        deadline: 'April 12, 2026',
        type: 'red',
        priority: 'Critical'
      },
      {
        label: 'Monthly Recurring Revenue ($35K/mo)',
        current: 0,
        target: 35000,
        deadline: 'Ongoing',
        type: 'amber',
        priority: 'High'
      },
      {
        label: 'Debt Clearance ($200K by EOY)',
        current: parseInt(this.getTotalRevenue().replace(/,/g, '')),
        target: 200000,
        deadline: 'December 31, 2026',
        type: 'blue',
        priority: 'Medium'
      }
    ];

    return targets.map(target => {
      const percentage = Math.min(Math.round((target.current / target.target) * 100), 100);
      return `
        <div class="progress">
          <div class="progress-header">
            <span class="progress-label">${target.label}</span>
            <span class="progress-value">$${target.current.toLocaleString()} / $${target.target.toLocaleString()}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill fill-${target.type}" style="width: ${percentage}%"></div>
          </div>
          <div class="flex" style="justify-content: space-between; margin-top: 6px; font-size: 0.75rem; color: var(--muted);">
            <span>${target.deadline}</span>
            <span>${target.priority} Priority</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderRevenueBreakdown() {
    const sources = [
      { name: 'Executive Intelligence', amount: 0, percentage: 0, color: 'blue' },
      { name: 'Trading Operations', amount: parseInt(this.getTotalRevenue().replace(/,/g, '')), percentage: 100, color: 'green' },
      { name: 'Content & Courses', amount: 0, percentage: 0, color: 'amber' },
      { name: 'Consulting', amount: 0, percentage: 0, color: 'cyan' }
    ];

    return `
      <div class="revenue-sources">
        ${sources.map(source => `
          <div class="list-item">
            <div class="list-icon" style="background: rgba(${this.getColorRGB(source.color)}, 0.15);">
              ${this.getSourceIcon(source.name)}
            </div>
            <div class="list-content">
              <div class="list-title">${source.name}</div>
              <div class="list-subtitle">$${source.amount.toLocaleString()} (${source.percentage}%)</div>
            </div>
            <div class="list-meta">
              <span class="badge badge-${source.color}">${source.percentage}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderCashFlow() {
    const cashFlow = [
      { type: 'Income', amount: parseInt(this.getTotalRevenue().replace(/,/g, '')), color: 'green' },
      { type: 'Operating Expenses', amount: 0, color: 'red' },
      { type: 'Marketing Spend', amount: 0, color: 'amber' },
      { type: 'Net Cash Flow', amount: parseInt(this.getTotalRevenue().replace(/,/g, '')), color: 'blue' }
    ];

    return `
      <div class="cash-flow">
        ${cashFlow.map(item => `
          <div class="list-item">
            <span class="list-content">${item.type}</span>
            <span class="list-meta font-mono" style="color: var(--${item.color});">
              ${item.amount >= 0 ? '+' : ''}$${item.amount.toLocaleString()}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderTargetsTable() {
    const targets = [
      {
        target: 'Urgent Fund',
        amount: '$50,000',
        current: `$${this.getTotalRevenue()}`,
        gap: `$${(50000 - parseInt(this.getTotalRevenue().replace(/,/g, ''))).toLocaleString()}`,
        deadline: 'Apr 12, 2026',
        status: 'In Progress',
        statusColor: 'amber'
      },
      {
        target: 'Monthly Recurring',
        amount: '$35,000/mo',
        current: '$0',
        gap: '$35,000',
        deadline: 'Ongoing',
        status: 'Not Started',
        statusColor: 'red'
      },
      {
        target: 'Debt Clearance',
        amount: '$200,000',
        current: `$${this.getTotalRevenue()}`,
        gap: `$${(200000 - parseInt(this.getTotalRevenue().replace(/,/g, ''))).toLocaleString()}`,
        deadline: 'Dec 31, 2026',
        status: 'Planning',
        statusColor: 'blue'
      }
    ];

    return `
      <table class="table">
        <thead>
          <tr>
            <th>Target</th>
            <th>Amount</th>
            <th>Current</th>
            <th>Gap</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${targets.map(target => `
            <tr>
              <td class="font-semibold">${target.target}</td>
              <td class="font-mono">${target.amount}</td>
              <td class="font-mono">${target.current}</td>
              <td class="font-mono">${target.gap}</td>
              <td>${target.deadline}</td>
              <td><span class="badge badge-${target.statusColor}">${target.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  getSourceIcon(sourceName) {
    const icons = {
      'Executive Intelligence': '🧠',
      'Trading Operations': '📈',
      'Content & Courses': '📚',
      'Consulting': '💼'
    };
    return icons[sourceName] || '💰';
  }

  getColorRGB(color) {
    const colors = {
      'blue': '99, 102, 241',
      'green': '52, 211, 153',
      'amber': '251, 191, 36',
      'red': '248, 113, 113',
      'cyan': '34, 211, 238'
    };
    return colors[color] || '99, 102, 241';
  }

  async refresh() {
    console.log('🔄 Refreshing finances...');
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['finances'] = FinancesPage;