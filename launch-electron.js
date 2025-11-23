// Simple Node.js launcher to clear ELECTRON_RUN_AS_NODE and start Electron
const { spawn } = require('child_process');
const path = require('path');

// Clear the problematic environment variable
delete process.env.ELECTRON_RUN_AS_NODE;

// Launch Electron
const electronPath = require('electron');
const appPath = path.join(__dirname);

const child = spawn(electronPath, [appPath], {
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  process.exit(code);
});
