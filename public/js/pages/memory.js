/**
 * Memory Page - Knowledge Graph Browser
 */
class MemoryPage {
  constructor() {
    this.memoryData = null;
    this.lifeData = null;
    this.currentView = 'timeline'; // timeline, search, knowledge-graph
  }

  async render(container, params = []) {
    try {
      this.memoryData = await api.getMemory();
      this.lifeData = await api.getLife();

      container.innerHTML = `
        <!-- Memory Header -->
        <div class="flex" style="justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h1>🧠 Memory & Knowledge</h1>
            <div class="flex" style="gap: 16px; margin-top: 8px;">
              <span class="badge badge-blue">${this.memoryData.length} Daily Notes</span>
              <span class="badge badge-green">${Object.keys(this.lifeData.entities || {}).length} Entities</span>
            </div>
          </div>
          <div class="flex" style="gap: 12px;">
            <button class="btn ${this.currentView === 'search' ? 'btn-primary' : 'btn-secondary'}" onclick="window._memoryPage.switchView('search')">
              🔍 Search
            </button>
            <button class="btn ${this.currentView === 'timeline' ? 'btn-primary' : 'btn-secondary'}" onclick="window._memoryPage.switchView('timeline')">
              📅 Timeline
            </button>
            <button class="btn ${this.currentView === 'knowledge-graph' ? 'btn-primary' : 'btn-secondary'}" onclick="window._memoryPage.switchView('knowledge-graph')">
              🕸️ Knowledge Graph
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="card" style="margin-bottom: 24px;">
          <div class="flex" style="gap: 12px; align-items: center;">
            <input type="text" class="input" placeholder="Search across all memory files..." id="memory-search" style="flex: 1;">
            <button class="btn btn-primary" onclick="window._memoryPage.performSearch()">Search</button>
          </div>
        </div>

        <!-- Content Area -->
        <div id="memory-content">
          ${this.renderCurrentView()}
        </div>

        <style>
        .memory-timeline {
          display: grid;
          gap: 16px;
        }

        .memory-entry {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .memory-entry:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
        }

        .memory-entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .memory-entry-date {
          font-weight: 700;
          font-size: 1.1rem;
        }

        .memory-entry-preview {
          color: var(--muted);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .memory-entry-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding-top: 0;
        }

        .memory-entry.expanded .memory-entry-content {
          max-height: 1000px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .knowledge-entity {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .knowledge-entity:hover {
          border-color: var(--primary);
        }

        .entity-name {
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .entity-summary {
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .search-results {
          display: grid;
          gap: 12px;
        }

        .search-result {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
        }

        .search-result-source {
          font-size: 0.75rem;
          color: var(--primary-light);
          margin-bottom: 8px;
        }

        .search-result-content {
          color: var(--muted);
          line-height: 1.5;
        }

        .search-highlight {
          background: rgba(99, 102, 241, 0.3);
          padding: 2px 4px;
          border-radius: 3px;
        }
        </style>
      `;

      this.setupEventListeners();

    } catch (error) {
      console.error('Failed to render memory page:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Memory Error</h2>
          <p>Failed to load memory data: ${error.message}</p>
          <button class="btn btn-primary" onclick="app.navigate('dashboard')">Back to Dashboard</button>
        </div>
      `;
    }
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'search':
        return this.renderSearchView();
      case 'timeline':
        return this.renderTimelineView();
      case 'knowledge-graph':
        return this.renderKnowledgeGraphView();
      default:
        return this.renderTimelineView();
    }
  }

  renderSearchView() {
    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔍 Search Results</span>
        </div>
        <div id="search-results">
          <div class="text-center text-muted" style="padding: 40px;">
            <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
            <h3>Search Memory</h3>
            <p>Enter a search term above to find content across all memory files.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderTimelineView() {
    if (!this.memoryData || this.memoryData.length === 0) {
      return `
        <div class="card">
          <div class="text-center" style="padding: 40px;">
            <div style="font-size: 3rem; margin-bottom: 16px;">📝</div>
            <h3>No Memory Files Found</h3>
            <p class="text-muted">Daily notes will appear here as they are created.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="memory-timeline">
        ${this.memoryData.map(entry => this.renderMemoryEntry(entry)).join('')}
      </div>
    `;
  }

  renderMemoryEntry(entry) {
    const preview = entry.content
      .replace(/^#+ .+$/gm, '') // Remove headers
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 3)
      .join(' ')
      .substring(0, 200) + '...';

    return `
      <div class="memory-entry" data-date="${entry.date}" onclick="window._memoryPage.toggleMemoryEntry('${entry.date}')">
        <div class="memory-entry-header">
          <div class="memory-entry-date">${api.formatDate(entry.date + 'T00:00:00Z')}</div>
          <div class="flex" style="gap: 8px; align-items: center;">
            <span class="badge badge-blue text-xs">${Math.round(entry.content.length / 1024 * 10) / 10} KB</span>
            <span class="text-xs text-muted">👁️ View</span>
          </div>
        </div>
        <div class="memory-entry-preview">${preview}</div>
        <div class="memory-entry-content" id="content-${entry.date}">
          <div class="content-markdown">
            ${api.parseMarkdown(entry.content)}
          </div>
        </div>
      </div>
    `;
  }

  renderKnowledgeGraphView() {
    if (!this.lifeData || !this.lifeData.entities) {
      return `
        <div class="card">
          <div class="text-center" style="padding: 40px;">
            <div style="font-size: 3rem; margin-bottom: 16px;">🕸️</div>
            <h3>Knowledge Graph Not Available</h3>
            <p class="text-muted">Knowledge graph data is not yet available.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="grid grid-2">
        <!-- Knowledge Graph Index -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">📚 Knowledge Index</span>
          </div>
          <div class="content-markdown">
            ${this.lifeData.indexHtml || '<p class="text-muted">No index available.</p>'}
          </div>
        </div>

        <!-- Entities Browser -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">🏷️ Entities</span>
            <span class="badge badge-green">${Object.keys(this.lifeData.entities).length} entities</span>
          </div>
          <div id="entities-list">
            ${this.renderEntitiesList()}
          </div>
        </div>

        <!-- Entity Details -->
        <div class="card col-span-2" id="entity-details" style="display: none;">
          <div class="card-header">
            <span class="card-title">📄 Entity Details</span>
            <button class="btn btn-secondary btn-sm" onclick="window._memoryPage.closeEntityDetails()">Close</button>
          </div>
          <div id="entity-content"></div>
        </div>
      </div>
    `;
  }

  renderEntitiesList() {
    const entities = this.lifeData.entities || {};

    return Object.entries(entities).map(([path, entity]) => {
      const name = path.split('/').pop() || path;
      const summaryPreview = entity.summary
        ? entity.summary.substring(0, 150) + '...'
        : 'No summary available';

      return `
        <div class="knowledge-entity" onclick="window._memoryPage.showEntityDetails('${path}')">
          <div class="entity-name">${name.replace(/-/g, ' ')}</div>
          <div class="entity-summary">${summaryPreview}</div>
          ${entity.items ? `<div class="badge badge-blue text-xs" style="margin-top: 8px;">${entity.items.length} items</div>` : ''}
        </div>
      `;
    }).join('') || '<p class="text-muted">No entities found.</p>';
  }

  setupEventListeners() {
    window._memoryPage = this;

    // Memory search functionality
    this.performSearch = () => {
      const query = document.getElementById('memory-search').value.trim().toLowerCase();
      if (!query) return;

      const results = this.searchMemory(query);
      this.displaySearchResults(results);
      this.currentView = 'search';
      this.updateViewButtons();
    };

    // Enter key search
    document.getElementById('memory-search').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });

    // View switching
    this.switchView = (view) => {
      this.currentView = view;
      const contentEl = document.getElementById('memory-content');
      contentEl.innerHTML = this.renderCurrentView();
      this.updateViewButtons();
      this.setupEventListeners(); // Re-setup for new content
    };

    // Memory entry toggle
    this.toggleMemoryEntry = (date) => {
      const entry = document.querySelector(`[data-date="${date}"]`);
      const content = document.getElementById(`content-${date}`);

      if (entry && content) {
        entry.classList.toggle('expanded');
      }
    };

    // Entity details
    this.showEntityDetails = (entityPath) => {
      const entity = this.lifeData.entities[entityPath];
      if (!entity) return;

      const detailsEl = document.getElementById('entity-details');
      const contentEl = document.getElementById('entity-content');

      if (detailsEl && contentEl) {
        contentEl.innerHTML = `
          <div class="content-markdown">
            ${entity.summaryHtml || api.parseMarkdown(entity.summary || 'No summary available.')}
          </div>
          ${entity.items ? `
            <div style="margin-top: 24px;">
              <h4>Items (${entity.items.length})</h4>
              <pre class="code" style="background: var(--surface); padding: 16px; border-radius: 8px; overflow-x: auto; margin-top: 12px;">${JSON.stringify(entity.items, null, 2)}</pre>
            </div>
          ` : ''}
        `;
        detailsEl.style.display = 'block';
        detailsEl.scrollIntoView({ behavior: 'smooth' });
      }
    };

    this.closeEntityDetails = () => {
      const detailsEl = document.getElementById('entity-details');
      if (detailsEl) {
        detailsEl.style.display = 'none';
      }
    };
  }

  searchMemory(query) {
    const results = [];

    // Search daily notes
    this.memoryData.forEach(entry => {
      const content = entry.content.toLowerCase();
      if (content.includes(query)) {
        const lines = entry.content.split('\n');
        const matchingLines = lines.filter(line => line.toLowerCase().includes(query));

        matchingLines.forEach(line => {
          results.push({
            source: `Daily Note - ${api.formatDate(entry.date + 'T00:00:00Z')}`,
            content: line.trim(),
            type: 'daily-note',
            date: entry.date
          });
        });
      }
    });

    // Search entities
    Object.entries(this.lifeData.entities || {}).forEach(([path, entity]) => {
      if (entity.summary && entity.summary.toLowerCase().includes(query)) {
        results.push({
          source: `Entity - ${path}`,
          content: entity.summary,
          type: 'entity',
          path
        });
      }
    });

    return results.slice(0, 20); // Limit to 20 results
  }

  displaySearchResults(results) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;

    if (results.length === 0) {
      resultsEl.innerHTML = `
        <div class="text-center text-muted" style="padding: 40px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
          <h3>No Results Found</h3>
          <p>Try a different search term.</p>
        </div>
      `;
      return;
    }

    const query = document.getElementById('memory-search').value.trim();

    resultsEl.innerHTML = `
      <div class="search-results">
        ${results.map(result => `
          <div class="search-result">
            <div class="search-result-source">${result.source}</div>
            <div class="search-result-content">
              ${this.highlightSearchTerm(result.content, query)}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  highlightSearchTerm(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  updateViewButtons() {
    // Update button states - this would be called after view changes
    document.querySelectorAll('[onclick*="switchView"]').forEach(btn => {
      const view = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
      if (view === this.currentView) {
        btn.className = 'btn btn-primary';
      } else {
        btn.className = 'btn btn-secondary';
      }
    });
  }

  async refresh() {
    console.log('🔄 Refreshing memory...');
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['memory'] = MemoryPage;