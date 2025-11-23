const { exec } = require('child_process');
const util = require('util');
const os = require('os');
const fs = require('fs');
const path = require('path');

const execPromise = util.promisify(exec);

async function getDiskSpace() {
  try {
    // Get system drive (usually C:)
    const systemDrive = process.env.SystemDrive || 'C:';
    
    // Use PowerShell to get disk space info
    const psCommand = `Get-PSDrive ${systemDrive.replace(':', '')} | Select-Object Used,Free | ConvertTo-Json`;
    const { stdout } = await execPromise(`powershell.exe -NoProfile -Command "${psCommand}"`, {
      maxBuffer: 1024 * 1024
    });
    
    const diskInfo = JSON.parse(stdout);
    const usedBytes = parseInt(diskInfo.Used);
    const freeBytes = parseInt(diskInfo.Free);
    const totalBytes = usedBytes + freeBytes;
    const freePercent = Math.round((freeBytes / totalBytes) * 100);
    
    return {
      total: totalBytes,
      free: freeBytes,
      used: usedBytes,
      freePercent
    };
  } catch (error) {
    console.error('Error getting disk space:', error);
    // Fallback values
    return {
      total: 0,
      free: 0,
      used: 0,
      freePercent: 50
    };
  }
}

async function getTempFilesSize() {
  try {
    const tempPaths = [
      process.env.TEMP || path.join(os.tmpdir()),
      'C:\\Windows\\Temp'
    ];
    
    let totalSize = 0;
    
    for (const tempPath of tempPaths) {
      try {
        // Use PowerShell to calculate folder size
        const psCommand = `(Get-ChildItem -Path "${tempPath}" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum`;
        const { stdout } = await execPromise(`powershell.exe -NoProfile -Command "${psCommand}"`, {
          maxBuffer: 1024 * 1024,
          timeout: 5000 // 5 second timeout
        });
        
        const size = parseInt(stdout.trim()) || 0;
        totalSize += size;
      } catch (err) {
        console.warn(`Could not calculate size for ${tempPath}:`, err.message);
      }
    }
    
    // Convert bytes to KB
    return Math.floor(totalSize / 1024);
  } catch (error) {
    console.error('Error getting temp files size:', error);
    return 0;
  }
}

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

module.exports = { 
  getInstalledApps, 
  uninstallApp,
  getDiskSpace,
  getTempFilesSize
};
