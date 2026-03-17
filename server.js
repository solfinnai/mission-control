const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = 3333;
const WORKSPACE = path.join(__dirname, '..');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper: read file safely
function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(WORKSPACE, filePath), 'utf8');
  } catch (e) {
    return null;
  }
}

// Helper: read JSON file
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(WORKSPACE, filePath), 'utf8'));
  } catch (e) {
    return null;
  }
}

// API: Get full dashboard state
app.get('/api/state', (req, res) => {
  const missionControl = readFile('MISSION-CONTROL.md');
  const finances = readFile('FINANCES.md');
  const tradingState = readJSON('TRADING-STATE.json');
  const tradingConfig = readFile('TRADING.md');
  const tradingLog = readFile('TRADING-LOG.md');
  const soul = readFile('SOUL.md');
  const identity = readFile('IDENTITY.md');
  const henry = readFile('HENRY.md');
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const dailyNotes = readFile(`memory/${today}.md`);
  const yesterdayNotes = readFile(`memory/${yesterday}.md`);
  
  // Get all project files
  const projects = {};
  const projectDir = path.join(WORKSPACE, 'PROJECTS');
  if (fs.existsSync(projectDir)) {
    const items = fs.readdirSync(projectDir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.md')) {
        projects[item.name.replace('.md', '')] = readFile(`PROJECTS/${item.name}`);
      } else if (item.isDirectory()) {
        const subFiles = {};
        const subDir = path.join(projectDir, item.name);
        for (const f of fs.readdirSync(subDir)) {
          if (f.endsWith('.md')) {
            subFiles[f] = readFile(`PROJECTS/${item.name}/${f}`);
          }
        }
        projects[item.name] = subFiles;
      }
    }
  }

  // Get life knowledge graph
  const lifeIndex = readFile('life/index.md');

  res.json({
    missionControl,
    finances,
    tradingState,
    tradingConfig,
    tradingLog,
    soul,
    identity,
    henry: henry ? '(loaded)' : null, // Don't expose full henry file to browser
    dailyNotes,
    yesterdayNotes,
    projects,
    lifeIndex,
    timestamp: new Date().toISOString(),
    today
  });
});

// API: Get specific file as markdown
app.get('/api/file/:path(*)', (req, res) => {
  const content = readFile(req.params.path);
  if (content) {
    res.json({ content, html: marked(content) });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// API: List all workspace files
app.get('/api/files', (req, res) => {
  function walk(dir, prefix = '') {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === 'mission-control') continue;
      const rel = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.isDirectory()) {
        results.push({ name: rel, type: 'dir' });
        results.push(...walk(path.join(dir, item.name), rel));
      } else {
        results.push({ name: rel, type: 'file', size: fs.statSync(path.join(dir, item.name)).size });
      }
    }
    return results;
  }
  res.json(walk(WORKSPACE));
});

// API: List files in specific directory
app.get('/api/files/:dir(*)', (req, res) => {
  const dir = req.params.dir;
  const fullPath = path.join(WORKSPACE, dir);
  try {
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    const results = items.map(item => ({
      name: item.name,
      type: item.isDirectory() ? 'dir' : 'file',
      size: item.isFile() ? fs.statSync(path.join(fullPath, item.name)).size : 0
    })).filter(item => !item.name.startsWith('.'));
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Get all projects
app.get('/api/projects', (req, res) => {
  const projects = {};
  const projectDir = path.join(WORKSPACE, 'PROJECTS');
  if (fs.existsSync(projectDir)) {
    const items = fs.readdirSync(projectDir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.md')) {
        projects[item.name.replace('.md', '')] = {
          type: 'file',
          content: readFile(`PROJECTS/${item.name}`),
          lastModified: fs.statSync(path.join(projectDir, item.name)).mtime
        };
      } else if (item.isDirectory()) {
        const subFiles = {};
        const subDir = path.join(projectDir, item.name);
        for (const f of fs.readdirSync(subDir)) {
          if (f.endsWith('.md')) {
            subFiles[f] = readFile(`PROJECTS/${item.name}/${f}`);
          }
        }
        projects[item.name] = {
          type: 'directory',
          files: subFiles,
          lastModified: fs.statSync(subDir).mtime
        };
      }
    }
  }
  res.json(projects);
});

// API: Get trading data
app.get('/api/trading', (req, res) => {
  const tradingState = readJSON('TRADING-STATE.json');
  const tradingConfig = readFile('TRADING.md');
  const tradingLog = readFile('TRADING-LOG.md');

  res.json({
    state: tradingState,
    config: tradingConfig,
    log: tradingLog,
    configHtml: tradingConfig ? marked(tradingConfig) : null,
    logHtml: tradingLog ? marked(tradingLog) : null
  });
});

// API: Get memory files
app.get('/api/memory', (req, res) => {
  const memoryDir = path.join(WORKSPACE, 'memory');
  const memories = [];

  if (fs.existsSync(memoryDir)) {
    const files = fs.readdirSync(memoryDir)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Sort newest first

    for (const file of files) {
      const content = readFile(`memory/${file}`);
      if (content) {
        memories.push({
          date: file.replace('.md', ''),
          filename: file,
          content: content,
          html: marked(content)
        });
      }
    }
  }

  res.json(memories);
});

// API: Get specific daily note
app.get('/api/memory/:date', (req, res) => {
  const date = req.params.date;
  const content = readFile(`memory/${date}.md`);
  if (content) {
    res.json({
      date,
      content,
      html: marked(content)
    });
  } else {
    res.status(404).json({ error: 'Daily note not found' });
  }
});

// API: Get life knowledge graph
app.get('/api/life', (req, res) => {
  const lifeDir = path.join(WORKSPACE, 'life');
  const entities = {};

  if (fs.existsSync(lifeDir)) {
    function walkLife(dir, prefix = '') {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const rel = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.isDirectory()) {
          walkLife(path.join(dir, item.name), rel);
        } else if (item.name === 'summary.md') {
          const summary = readFile(`life/${rel}`);
          if (summary) {
            entities[prefix || 'root'] = {
              summary: summary,
              summaryHtml: marked(summary)
            };
          }
        } else if (item.name === 'items.json') {
          const items = readJSON(`life/${rel}`);
          if (items && entities[prefix || 'root']) {
            entities[prefix || 'root'].items = items;
          }
        }
      }
    }
    walkLife(lifeDir);
  }

  const index = readFile('life/index.md');
  res.json({
    index: index,
    indexHtml: index ? marked(index) : null,
    entities
  });
});

app.listen(PORT, () => {
  console.log(`\n  ☀️  Sol Finn Mission Control`);
  console.log(`  → http://localhost:${PORT}\n`);
});
