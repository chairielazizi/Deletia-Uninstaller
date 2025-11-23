const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const fs = require('fs');
const os = require('os');

async function getInstalledApps() {
  try {
    const tempFile = path.join(os.tmpdir(), `lumina-apps-${Date.now()}.json`);
    const scriptPath = path.join(__dirname, 'get-apps.ps1');
    
    // Execute PowerShell script with temp file path as parameter
    const command = `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}" -OutputFile "${tempFile}"`;
    
    console.log('Executing PowerShell command:', command);
    const { stdout, stderr } = await execPromise(command, { maxBuffer: 1024 * 1024 * 10 });
    
    if (stderr) {
      console.error('PowerShell stderr:', stderr);
    }
    if (stdout) {
      console.log('PowerShell stdout:', stdout);
    }
    
    // Read the JSON from the temp file
    if (fs.existsSync(tempFile)) {
      const jsonString = fs.readFileSync(tempFile, 'utf8');
      fs.unlinkSync(tempFile); // Clean up
      
      const apps = JSON.parse(jsonString);
      console.log(`Successfully loaded ${apps.length} installed applications`);
      return apps;
    } else {
      console.warn("Temp file was not created by PowerShell");
      return [];
    }
  } catch (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
}

async function uninstallApp(uninstallString) {
  if (!uninstallString) return false;
  
  try {
    console.log(`Executing uninstall: ${uninstallString}`);
    exec(uninstallString); 
    return true;
  } catch (error) {
    console.error("Error launching uninstaller:", error);
    return false;
  }
}

module.exports = { getInstalledApps, uninstallApp };
