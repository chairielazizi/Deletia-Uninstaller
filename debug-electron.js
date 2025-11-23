const electron = require('electron');
console.log('Electron keys:', Object.keys(electron));
console.log('App type:', typeof electron.app);

if (electron.app) {
  console.log('Electron app loaded successfully');
  electron.app.quit();
} else {
  console.error('Electron app is undefined!');
  process.exit(1);
}
