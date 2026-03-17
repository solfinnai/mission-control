/**
 * Sol Finn Mission Control - API Client
 * Handles all API communication with the backend
 */

class API {
  constructor() {
    this.baseURL = '';
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds default
  }

  /**
   * Generic fetch with error handling and caching
   */
  async fetch(endpoint, options = {}) {
    const { cache = true, cacheTTL = this.cacheTimeout } = options;
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

    // Check cache first
    if (cache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheTTL) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(`${this.baseURL}/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful responses
      if (cache && response.ok) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Clear cache for specific endpoint or all cache
   */
  clearCache(endpoint = null) {
    if (endpoint) {
      // Clear all cache entries that start with the endpoint
      for (const key of this.cache.keys()) {
        if (key.startsWith(endpoint)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Dashboard & Overview Data
   */
  async getState() {
    return this.fetch('/state', { cacheTTL: 30000 }); // 30s cache
  }

  /**
   * File Operations
   */
  async getFile(path) {
    return this.fetch(`/file/${encodeURIComponent(path)}`);
  }

  async getFiles() {
    return this.fetch('/files', { cacheTTL: 60000 }); // 1min cache
  }

  async getDirectoryFiles(dir) {
    return this.fetch(`/files/${encodeURIComponent(dir)}`);
  }

  /**
   * Projects
   */
  async getProjects() {
    return this.fetch('/projects', { cacheTTL: 60000 }); // 1min cache
  }

  async getProject(projectId) {
    const projects = await this.getProjects();
    return projects[projectId] || null;
  }

  /**
   * Trading
   */
  async getTrading() {
    return this.fetch('/trading', { cacheTTL: 10000 }); // 10s cache for trading
  }

  /**
   * Memory & Knowledge
   */
  async getMemory() {
    return this.fetch('/memory', { cacheTTL: 30000 });
  }

  async getDailyNote(date) {
    return this.fetch(`/memory/${date}`);
  }

  async getLife() {
    return this.fetch('/life', { cacheTTL: 300000 }); // 5min cache
  }

  /**
   * Real-time data refresh helpers
   */
  setupAutoRefresh(callback, interval = 30000) {
    const refreshId = setInterval(() => {
      this.clearCache('/state');
      callback();
    }, interval);

    return refreshId;
  }

  setupTradingRefresh(callback, interval = 10000) {
    const refreshId = setInterval(() => {
      this.clearCache('/trading');
      callback();
    }, interval);

    return refreshId;
  }

  /**
   * Utility methods
   */
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateStr, options = {}) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options
    });
  }

  formatTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Parse markdown content for UI display
   */
  parseMarkdown(content) {
    if (!content) return '';

    return content
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  /**
   * Extract tasks from markdown content
   */
  extractTasks(content) {
    if (!content) return [];

    const lines = content.split('\n');
    const tasks = [];

    lines.forEach((line, index) => {
      const taskMatch = line.match(/^[\s]*[-\*]\s*\[([x\s])\]\s*(.+)$/);
      if (taskMatch) {
        tasks.push({
          id: `task-${index}`,
          text: taskMatch[2].trim(),
          completed: taskMatch[1] === 'x',
          line: index
        });
      }
    });

    return tasks;
  }

  /**
   * Extract financial targets from content
   */
  extractTargets(content) {
    if (!content) return [];

    const targets = [];
    const lines = content.split('\n');

    lines.forEach(line => {
      // Match patterns like "$50K by Apr 12" or "$35K/month"
      const targetMatch = line.match(/\$([0-9,]+)([KMB]?).*?by\s+([A-Za-z]+\s+\d+)|(\$[0-9,]+)([KMB]?)\/([a-z]+)/i);
      if (targetMatch) {
        const amount = parseInt(targetMatch[1]?.replace(/,/g, '') || targetMatch[4]?.replace(/[$,]/g, ''));
        const multiplier = targetMatch[2] === 'K' ? 1000 : targetMatch[2] === 'M' ? 1000000 : 1;
        const deadline = targetMatch[3] || `per ${targetMatch[6]}`;

        targets.push({
          amount: amount * multiplier,
          deadline,
          description: line.trim()
        });
      }
    });

    return targets;
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      await this.fetch('/state');
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'error', error: error.message, timestamp: new Date().toISOString() };
    }
  }
}

// Export singleton instance
window.api = new API();