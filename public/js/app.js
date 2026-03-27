/**
 * Sol Finn Mission Control - SPA Application Shell
 * Handles routing, navigation, and app-wide functionality
 */

class MissionControlApp {
  constructor() {
    this.currentPage = null;
    this.currentRoute = null;
    this.pages = new Map();
    this.refreshIntervals = new Map();

    this.initializeApp();
    this.setupRouter();
    this.setupNavigation();
    this.setupClock();
  }

  /**
   * Initialize the application
   */
  async initializeApp() {
    console.log('🚀 Sol Finn Mission Control initializing...');

    // Load initial data
    try {
      await api.healthCheck();
      console.log('✅ API connection healthy');
    } catch (error) {
      console.error('❌ API connection failed:', error);
      this.showError('Unable to connect to Mission Control backend');
    }

    // Setup auto-refresh for dashboard data
    this.setupAutoRefresh();

    console.log('✅ Mission Control online');
  }

  /**
   * Setup hash-based routing
   */
  setupRouter() {
    this.routes = {
      '': 'dashboard',
      'dashboard': 'dashboard',
      'office': 'office',
      'tasks': 'tasks',
      'projects': 'projects',
      'projects/:id': 'project-detail',
      'finances': 'finances',
      'trading': 'trading',
      'content': 'content',
      'comms': 'comms',
      'memory': 'memory',
      'docs': 'docs',
      'calendar': 'calendar',
      'team': 'team',
      'toolbox': 'toolbox',
      'activity-log': 'activity-log',
      'settings': 'settings'
    };

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());

    // Handle initial route
    this.handleRouteChange();
  }

  /**
   * Handle route changes
   */
  async handleRouteChange() {
    const hash = window.location.hash.slice(1).replace(/^\//, '') || '';
    const parts = hash.split('/').filter(Boolean);
    const route = parts[0] || 'dashboard';
    const params = parts.slice(1);

    console.log('📍 Navigating to:', route);

    // Clear existing refresh intervals when changing pages
    this.clearPageRefresh();

    // Update active nav item
    this.updateActiveNav(route);

    // Update page title
    this.updatePageTitle(route);

    // Load the appropriate page
    await this.loadPage(route, params);

    this.currentRoute = hash;
  }

  /**
   * Load a page module
   */
  async loadPage(pageName, params = []) {
    const contentArea = document.getElementById('content-area');

    try {
      // Show loading state
      contentArea.innerHTML = '<div class="loading">Loading...</div>';

      // Check if page module is already loaded
      if (!this.pages.has(pageName)) {
        console.log('📦 Loading page module:', pageName);

        // Look up page class from the global registry
        const PageClass = window.PageModules && window.PageModules[pageName];
        if (!PageClass) {
          throw new Error(`Page module "${pageName}" not registered`);
        }
        this.pages.set(pageName, new PageClass());
      }

      const page = this.pages.get(pageName);

      // Render the page
      if (page && typeof page.render === 'function') {
        await page.render(contentArea, params);

        // Set up page-specific refresh intervals if needed
        if (typeof page.setupRefresh === 'function') {
          const refreshId = page.setupRefresh();
          if (refreshId) {
            this.refreshIntervals.set(pageName, refreshId);
          }
        }

        this.currentPage = page;
      } else {
        throw new Error(`Page module ${pageName} not found or invalid`);
      }

    } catch (error) {
      console.error('❌ Failed to load page:', pageName, error);
      contentArea.innerHTML = `
        <div class="card">
          <h2>Page Not Found</h2>
          <p>The page "${pageName}" could not be loaded.</p>
          <button class="btn btn-primary" onclick="app.navigate('dashboard')">Go Home</button>
        </div>
      `;
    }
  }

  /**
   * Navigate to a route
   */
  navigate(route, replace = false) {
    const newHash = `#${route}`;

    if (replace) {
      window.location.replace(newHash);
    } else {
      window.location.hash = newHash;
    }
  }

  /**
   * Update active navigation item
   */
  updateActiveNav(route) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to current route
    const activeNav = document.querySelector(`[data-route="${route}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }

    // Handle projects submenu
    if (route === 'projects') {
      const projectsNav = document.querySelector('[data-route="projects"]');
      if (projectsNav && projectsNav.classList.contains('nav-item-expandable')) {
        projectsNav.classList.add('expanded');
        const submenu = projectsNav.nextElementSibling;
        if (submenu) {
          submenu.classList.add('expanded');
        }
      }
    }
  }

  /**
   * Update page title
   */
  updatePageTitle(route) {
    const titles = {
      'dashboard': '🏠 Dashboard',
      'office': '🏢 Office',
      'tasks': '📋 Tasks',
      'projects': '📊 Projects',
      'finances': '💰 Finances',
      'trading': '📈 Trading',
      'content': '✍️ Content',
      'comms': '📧 Communications',
      'memory': '🧠 Memory',
      'docs': '📁 Docs',
      'calendar': '📅 Calendar',
      'team': '👥 Team',
      'toolbox': '🧰 Toolbox',
      'activity-log': '📋 Activity Log',
      'settings': '⚙️ Settings'
    };

    const title = titles[route] || '☀️ Mission Control';
    document.getElementById('page-title').textContent = title;
    document.title = `${title} — Sol Finn Mission Control`;
  }

  /**
   * Setup navigation event listeners
   */
  setupNavigation() {
    // Handle nav item clicks
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('[data-route]');
      if (navItem && navItem.dataset.route) {
        e.preventDefault();
        this.navigate(navItem.dataset.route);
      }

      // Handle expandable nav items
      if (e.target.closest('.nav-item-expandable')) {
        const expandable = e.target.closest('.nav-item-expandable');
        expandable.classList.toggle('expanded');
        const submenu = expandable.nextElementSibling;
        if (submenu) {
          submenu.classList.toggle('expanded');
        }
      }
    });

    // Handle manual refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshCurrentPage());
    }
  }

  /**
   * Setup the real-time clock
   */
  setupClock() {
    const updateClock = () => {
      const now = new Date();

      // Update sidebar clock
      const currentTime = document.getElementById('current-time');
      if (currentTime) {
        currentTime.textContent = now.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }

      // Update last-updated in header
      const lastUpdated = document.getElementById('last-updated');
      if (lastUpdated) {
        lastUpdated.textContent = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }

      // Update day counter (days since March 12, 2026)
      const startDate = new Date('2026-03-12');
      const daysDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const dayCounter = document.getElementById('day-counter');
      if (dayCounter) {
        dayCounter.textContent = `Day ${daysDiff}`;
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  /**
   * Setup auto-refresh for real-time data
   */
  setupAutoRefresh() {
    // Refresh dashboard data every 30 seconds
    this.dashboardRefresh = api.setupAutoRefresh(() => {
      if (!this.currentRoute || this.currentRoute === 'dashboard') {
        this.refreshCurrentPage();
      }
    }, 30000);

    // Refresh trading data every 10 seconds
    this.tradingRefresh = api.setupTradingRefresh(() => {
      if (this.currentRoute === 'trading') {
        this.refreshCurrentPage();
      }
    }, 10000);
  }

  /**
   * Refresh the current page
   */
  async refreshCurrentPage() {
    console.log('🔄 Refreshing current page...');

    if (this.currentPage && typeof this.currentPage.refresh === 'function') {
      await this.currentPage.refresh();
    } else {
      // Fallback: reload the entire page
      const parts = (this.currentRoute || '').replace(/^\//, '').split('/').filter(Boolean);
      const route = parts[0] || 'dashboard';
      const params = parts.slice(1);
      await this.loadPage(route, params);
    }
  }

  /**
   * Clear page-specific refresh intervals
   */
  clearPageRefresh() {
    for (const [pageName, intervalId] of this.refreshIntervals) {
      clearInterval(intervalId);
    }
    this.refreshIntervals.clear();
  }

  /**
   * Show error message
   */
  showError(message) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
      <div class="card" style="border-color: var(--red);">
        <h2 style="color: var(--red);">⚠️ Error</h2>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Reload</button>
      </div>
    `;
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add to page
    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /**
   * Cleanup when app is destroyed
   */
  destroy() {
    // Clear all intervals
    clearInterval(this.dashboardRefresh);
    clearInterval(this.tradingRefresh);
    this.clearPageRefresh();

    // Clear API cache
    api.clearCache();

    console.log('🔌 Mission Control disconnected');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MissionControlApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.app) {
    window.app.destroy();
  }
});