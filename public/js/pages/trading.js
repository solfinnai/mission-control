/**
 * Trading Page - Trading Control Panel
 */
class TradingPage {
  constructor() {
    this.tradingData = null;
    this.refreshInterval = null;
  }

  async render(container, params = []) {
    try {
      this.tradingData = await api.getTrading();

      container.innerHTML = `
        <div class="grid grid-4">
          <!-- Trading Control Panel -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">🎛️ Trading Control Panel</span>
              <span class="badge badge-amber">Phase 1: Research Only</span>
            </div>
            <div class="grid grid-4">
              <div class="control-panel-item">
                <div class="control-label">Kill Switch</div>
                <div class="control-status status-safe">
                  <span class="status-indicator"></span>
                  INACTIVE ✓
                </div>
                <div class="control-subtitle">All trading stopped if activated</div>
              </div>

              <div class="control-panel-item">
                <div class="control-label">Autonomy Level</div>
                <div class="control-status status-research">
                  <span class="autonomy-level">1</span>
                  RESEARCH
                </div>
                <div class="control-subtitle">Analysis only, no trades</div>
              </div>

              <div class="control-panel-item">
                <div class="control-label">Bankroll</div>
                <div class="control-status">
                  <span class="bankroll-amount">$${this.getBankroll()}</span>
                </div>
                <div class="control-subtitle">Available for trading</div>
              </div>

              <div class="control-panel-item">
                <div class="control-label">Daily P&L</div>
                <div class="control-status ${this.getDailyPnL() >= 0 ? 'status-profit' : 'status-loss'}">
                  <span class="pnl-amount">${this.getDailyPnL() >= 0 ? '+' : ''}$${this.getDailyPnL()}</span>
                </div>
                <div class="control-subtitle">Today's performance</div>
              </div>
            </div>
          </div>

          <!-- Platform Status -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">🔗 Connected Platforms</span>
            </div>
            ${this.renderPlatformStatus()}
          </div>

          <!-- Risk Parameters -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">⚠️ Risk Parameters</span>
            </div>
            ${this.renderRiskParameters()}
          </div>

          <!-- Open Positions -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">📊 Open Positions</span>
              <span class="badge badge-blue">${this.getOpenPositionsCount()} Active</span>
            </div>
            ${this.renderOpenPositions()}
          </div>

          <!-- Recent Trades -->
          <div class="card col-span-4">
            <div class="card-header">
              <span class="card-title">📈 Recent Trade Log</span>
            </div>
            ${this.renderTradeLog()}
          </div>
        </div>

        <style>
        .control-panel-item {
          text-align: center;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
        }

        .control-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .control-status {
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .control-subtitle {
          font-size: 0.7rem;
          color: var(--dim);
        }

        .status-safe {
          color: var(--green);
        }

        .status-research {
          color: var(--amber);
        }

        .status-profit {
          color: var(--green);
        }

        .status-loss {
          color: var(--red);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          animation: pulse 2s infinite;
        }

        .autonomy-level {
          background: var(--amber);
          color: black;
          padding: 4px 8px;
          border-radius: 4px;
          margin-right: 8px;
          font-weight: 900;
        }

        .platform-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .platform-item:last-child {
          border-bottom: none;
        }

        .platform-name {
          font-weight: 600;
        }

        .platform-balance {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        .risk-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 0.85rem;
          border-bottom: 1px solid var(--border);
        }

        .risk-item:last-child {
          border-bottom: none;
        }
        </style>
      `;

      this.setupEventListeners();

    } catch (error) {
      console.error('Failed to render trading page:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Trading Error</h2>
          <p>Failed to load trading data: ${error.message}</p>
          <button class="btn btn-primary" onclick="app.navigate('dashboard')">Back to Dashboard</button>
        </div>
      `;
    }
  }

  getBankroll() {
    return this.tradingData?.state?.bankroll || 1000;
  }

  getDailyPnL() {
    return this.tradingData?.state?.dailyPnL || 0;
  }

  getOpenPositionsCount() {
    return this.tradingData?.state?.openPositions?.length || 0;
  }

  renderPlatformStatus() {
    const platforms = [
      { name: 'Kalshi', status: 'approved', balance: 1000, color: 'amber' },
      { name: 'Polymarket', status: 'not_connected', balance: 0, color: 'red' },
      { name: 'Metaculus', status: 'not_connected', balance: 0, color: 'red' },
      { name: 'Manifold', status: 'not_connected', balance: 0, color: 'red' },
      { name: 'Augur', status: 'not_connected', balance: 0, color: 'red' },
      { name: 'PredictIt', status: 'not_connected', balance: 0, color: 'red' }
    ];

    return `
      <div class="platform-list">
        ${platforms.map(platform => `
          <div class="platform-item">
            <div>
              <div class="platform-name">${platform.name}</div>
              <span class="badge badge-${platform.color}">
                ${platform.status === 'approved' ? 'Approved' :
                  platform.status === 'connected' ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <div class="platform-balance">$${platform.balance.toLocaleString()}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderRiskParameters() {
    const riskParams = [
      { label: 'Max Position Size', value: '$100', limit: 'Per trade' },
      { label: 'Daily Loss Limit', value: '$250', limit: 'Per day' },
      { label: 'Max Open Positions', value: '5', limit: 'Simultaneous' },
      { label: 'Stop Loss', value: '20%', limit: 'Per position' },
      { label: 'Portfolio Risk', value: '2%', limit: 'Of total capital' }
    ];

    return `
      <div class="risk-params">
        ${riskParams.map(param => `
          <div class="risk-item">
            <div>
              <div>${param.label}</div>
              <div class="text-xs text-muted">${param.limit}</div>
            </div>
            <div class="font-mono font-bold">${param.value}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderOpenPositions() {
    const positions = this.tradingData?.state?.openPositions || [];

    if (positions.length === 0) {
      return `
        <div class="text-center" style="padding: 40px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">📊</div>
          <h3>No Open Positions</h3>
          <p class="text-muted">All positions are currently closed.</p>
        </div>
      `;
    }

    return `
      <table class="table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Market</th>
            <th>Side</th>
            <th>Entry Price</th>
            <th>Current Price</th>
            <th>Quantity</th>
            <th>P&L</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${positions.map(position => `
            <tr>
              <td><span class="badge badge-blue">${position.platform}</span></td>
              <td>${position.market}</td>
              <td><span class="badge badge-${position.side === 'YES' ? 'green' : 'red'}">${position.side}</span></td>
              <td class="font-mono">$${position.entryPrice}</td>
              <td class="font-mono">$${position.currentPrice}</td>
              <td class="font-mono">${position.quantity}</td>
              <td class="font-mono ${position.pnl >= 0 ? 'status-profit' : 'status-loss'}">
                ${position.pnl >= 0 ? '+' : ''}$${position.pnl}
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="this.showPositionDetails('${position.id}')">
                  Details
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderTradeLog() {
    // Parse trade log from markdown
    const logContent = this.tradingData?.log || '';
    const trades = this.parseTradeLog(logContent);

    if (trades.length === 0) {
      return `
        <div class="text-center" style="padding: 40px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">📝</div>
          <h3>No Trade History</h3>
          <p class="text-muted">Trade history will appear here once trading begins.</p>
        </div>
      `;
    }

    return `
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Platform</th>
            <th>Market</th>
            <th>Side</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>P&L</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          ${trades.slice(0, 10).map(trade => `
            <tr>
              <td>${api.formatDate(trade.date)}</td>
              <td><span class="badge badge-blue">${trade.platform}</span></td>
              <td>${trade.market}</td>
              <td><span class="badge badge-${trade.side === 'YES' ? 'green' : 'red'}">${trade.side}</span></td>
              <td class="font-mono">$${trade.entry}</td>
              <td class="font-mono">$${trade.exit}</td>
              <td class="font-mono ${trade.pnl >= 0 ? 'status-profit' : 'status-loss'}">
                ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl}
              </td>
              <td><span class="badge badge-${trade.result === 'WIN' ? 'green' : trade.result === 'LOSS' ? 'red' : 'amber'}">${trade.result}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${trades.length > 10 ? `
        <div class="text-center" style="margin-top: 16px;">
          <button class="btn btn-secondary" onclick="this.showFullTradeHistory()">
            View All ${trades.length} Trades
          </button>
        </div>
      ` : ''}
    `;
  }

  parseTradeLog(logContent) {
    // This would parse the markdown trade log into structured data
    // For now, return mock data
    return [
      {
        date: '2026-03-12',
        platform: 'Kalshi',
        market: 'Presidential Election 2028',
        side: 'YES',
        entry: 45,
        exit: 48,
        pnl: 30,
        result: 'WIN'
      }
    ];
  }

  setupEventListeners() {
    // Add any interactive elements here
    this.showPositionDetails = (positionId) => {
      console.log('Show position details for:', positionId);
      // Implementation for position details modal
    };

    this.showFullTradeHistory = () => {
      console.log('Show full trade history');
      // Implementation for full trade history view
    };
  }

  async refresh() {
    console.log('🔄 Refreshing trading data...');
    const container = document.getElementById('content-area');
    await this.render(container);
  }

  setupRefresh() {
    // Auto-refresh trading data every 10 seconds
    return setInterval(() => {
      this.refresh();
    }, 10000);
  }

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['trading'] = TradingPage;