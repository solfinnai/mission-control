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

app.listen(PORT, () => {
  console.log(`\n  ☀️  Sol Finn Mission Control`);
  console.log(`  → http://localhost:${PORT}\n`);
});
