/**
 * Docs Page - File Browser
 */
class DocsPage {
  constructor() {
    this.files = null;
    this.currentPath = '';
    this.currentFile = null;
  }

  async render(container, params = []) {
    try {
      this.files = await api.getFiles();

      container.innerHTML = `
        <div class="grid grid-3">
          <!-- File Tree -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">📁 Workspace Files</span>
            </div>
            <div id="file-tree">
              ${this.renderFileTree()}
            </div>
          </div>

          <!-- File Content -->
          <div class="card col-span-2">
            <div class="card-header">
              <span class="card-title">📄 ${this.currentFile || 'Select a file'}</span>
              ${this.currentFile ? `<button class="btn btn-secondary btn-sm" onclick="window._docsPage.downloadFile()">Download</button>` : ''}
            </div>
            <div id="file-content">
              ${this.renderFileContent()}
            </div>
          </div>
        </div>

        <style>
        .file-tree {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
        }

        .file-item {
          padding: 6px 8px;
          cursor: pointer;
          color: var(--muted);
          transition: all 0.2s ease;
          border-radius: 6px;
          margin: 2px 0;
        }

        .file-item:hover {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary-light);
        }

        .file-item.selected {
          background: rgba(99, 102, 241, 0.2);
          color: var(--primary-light);
        }

        .file-dir {
          color: var(--primary-light);
          font-weight: 600;
        }

        .file-markdown {
          color: var(--text);
        }

        .file-json {
          color: var(--amber);
        }

        .file-content-area {
          max-height: 70vh;
          overflow-y: auto;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px;
          background: var(--surface);
        }

        .code-content {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          line-height: 1.6;
          white-space: pre-wrap;
          color: var(--text);
        }
        </style>
      `;

      this.setupEventListeners();

    } catch (error) {
      console.error('Failed to render docs page:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Docs Error</h2>
          <p>Failed to load workspace files: ${error.message}</p>
          <button class="btn btn-primary" onclick="app.navigate('dashboard')">Back to Dashboard</button>
        </div>
      `;
    }
  }

  renderFileTree() {
    if (!this.files) return '<p>Loading files...</p>';

    const tree = this.buildFileTree(this.files);
    return this.renderTreeNode(tree, '');
  }

  buildFileTree(files) {
    const tree = {};

    files.forEach(file => {
      const parts = file.name.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1 && file.type === 'file') {
          current[part] = { type: 'file', ...file };
        } else {
          if (!current[part]) {
            current[part] = { type: 'dir', children: {} };
          }
          current = current[part].children || (current[part].children = {});
        }
      });
    });

    return tree;
  }

  renderTreeNode(node, path) {
    return Object.entries(node)
      .sort(([a, nodeA], [b, nodeB]) => {
        // Directories first, then files
        if (nodeA.type !== nodeB.type) {
          return nodeA.type === 'dir' ? -1 : 1;
        }
        return a.localeCompare(b);
      })
      .map(([name, item]) => {
        const fullPath = path ? `${path}/${name}` : name;

        if (item.type === 'dir') {
          return `
            <div class="file-item file-dir" onclick="window._docsPage.toggleDirectory('${fullPath}')">
              📁 ${name}/
            </div>
            <div id="dir-${fullPath.replace(/[^a-zA-Z0-9]/g, '_')}" style="margin-left: 16px; display: none;">
              ${this.renderTreeNode(item.children || {}, fullPath)}
            </div>
          `;
        } else {
          const icon = this.getFileIcon(name);
          const className = this.getFileClass(name);
          return `
            <div class="file-item ${className}" onclick="window._docsPage.selectFile('${fullPath}')">
              ${icon} ${name}
            </div>
          `;
        }
      }).join('');
  }

  getFileIcon(filename) {
    if (filename.endsWith('.md')) return '📄';
    if (filename.endsWith('.json')) return '📊';
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return '📜';
    if (filename.endsWith('.html')) return '🌐';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.txt')) return '📝';
    return '📄';
  }

  getFileClass(filename) {
    if (filename.endsWith('.md')) return 'file-markdown';
    if (filename.endsWith('.json')) return 'file-json';
    return '';
  }

  renderFileContent() {
    if (!this.currentFile) {
      return `
        <div class="text-center text-muted" style="padding: 60px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">📄</div>
          <h3>Select a File</h3>
          <p>Choose a file from the tree to view its contents.</p>
        </div>
      `;
    }

    return `<div id="file-display">Loading file...</div>`;
  }

  async loadFileContent(filePath) {
    try {
      const response = await api.getFile(filePath);
      const fileDisplay = document.getElementById('file-display');

      if (filePath.endsWith('.md')) {
        fileDisplay.innerHTML = `
          <div class="file-content-area">
            <div class="content-markdown">${response.html}</div>
          </div>
        `;
      } else if (filePath.endsWith('.json')) {
        const formatted = JSON.stringify(JSON.parse(response.content), null, 2);
        fileDisplay.innerHTML = `
          <div class="file-content-area">
            <div class="code-content">${formatted}</div>
          </div>
        `;
      } else {
        fileDisplay.innerHTML = `
          <div class="file-content-area">
            <div class="code-content">${response.content}</div>
          </div>
        `;
      }
    } catch (error) {
      document.getElementById('file-display').innerHTML = `
        <div class="text-center" style="padding: 40px;">
          <h3 style="color: var(--red);">Error Loading File</h3>
          <p class="text-muted">${error.message}</p>
        </div>
      `;
    }
  }

  setupEventListeners() {
    window._docsPage = this;

    this.toggleDirectory = (path) => {
      const dirId = 'dir-' + path.replace(/[^a-zA-Z0-9]/g, '_');
      const dirEl = document.getElementById(dirId);
      if (dirEl) {
        dirEl.style.display = dirEl.style.display === 'none' ? 'block' : 'none';
      }
    };

    this.selectFile = async (filePath) => {
      // Update selected state
      document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('selected');
      });

      event.target.classList.add('selected');

      this.currentFile = filePath;

      // Update header
      const headerTitle = document.querySelector('#file-content .card-title');
      if (headerTitle) {
        headerTitle.textContent = `📄 ${filePath}`;
      }

      // Load file content
      await this.loadFileContent(filePath);
    };

    this.downloadFile = () => {
      if (this.currentFile) {
        console.log('Download file:', this.currentFile);
        // Implementation for file download
      }
    };
  }

  async refresh() {
    console.log('🔄 Refreshing docs...');
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['docs'] = DocsPage;