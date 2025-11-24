# Get-CleanableFiles.ps1
# Scans system for cleanable files and returns size information

param()

$results = @()

# 1. Temporary Files (%TEMP%)
$tempPath = $env:TEMP
if (Test-Path $tempPath) {
    try {
        $tempSize = (Get-ChildItem -Path $tempPath -Recurse -File -ErrorAction SilentlyContinue | 
            Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        if ($null -eq $tempSize) { $tempSize = 0 }
        $tempSizeKB = [math]::Round($tempSize / 1KB, 2)
    } catch {
        $tempSizeKB = 0
    }
} else {
    $tempSizeKB = 0
}

$results += [PSCustomObject]@{
    id = 'temp'
    name = 'Temporary Files'
    path = '%TEMP%'
    size = $tempSizeKB
}

# 2. Windows Temp (C:\Windows\Temp)
$winTempPath = "$env:SystemRoot\Temp"
if (Test-Path $winTempPath) {
    try {
        $winTempSize = (Get-ChildItem -Path $winTempPath -Recurse -File -ErrorAction SilentlyContinue | 
            Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        if ($null -eq $winTempSize) { $winTempSize = 0 }
        $winTempSizeKB = [math]::Round($winTempSize / 1KB, 2)
    } catch {
        $winTempSizeKB = 0
    }
} else {
    $winTempSizeKB = 0
}

$results += [PSCustomObject]@{
    id = 'wintemp'
    name = 'Windows Temp'
    path = 'C:\Windows\Temp'
    size = $winTempSizeKB
}

# 3. Prefetch Files (C:\Windows\Prefetch)
$prefetchPath = "$env:SystemRoot\Prefetch"
if (Test-Path $prefetchPath) {
    try {
        $prefetchSize = (Get-ChildItem -Path $prefetchPath -File -ErrorAction SilentlyContinue | 
            Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        if ($null -eq $prefetchSize) { $prefetchSize = 0 }
        $prefetchSizeKB = [math]::Round($prefetchSize / 1KB, 2)
    } catch {
        $prefetchSizeKB = 0
    }
} else {
    $prefetchSizeKB = 0
}

$results += [PSCustomObject]@{
    id = 'prefetch'
    name = 'Prefetch Files'
    path = 'C:\Windows\Prefetch'
    size = $prefetchSizeKB
}

# 4. Recycle Bin
try {
    $recycleBinSize = 0
    $shell = New-Object -ComObject Shell.Application
    $recycleBin = $shell.Namespace(10)
    if ($recycleBin) {
        $items = $recycleBin.Items()
        foreach ($item in $items) {
            $recycleBinSize += $item.Size
        }
    }
    $recycleBinSizeKB = [math]::Round($recycleBinSize / 1KB, 2)
} catch {
    $recycleBinSizeKB = 0
}

$results += [PSCustomObject]@{
    id = 'recyclebin'
    name = 'Recycle Bin'
    path = 'System'
    size = $recycleBinSizeKB
}

# 5. Downloads Folder
$downloadsPath = "$env:USERPROFILE\Downloads"
if (Test-Path $downloadsPath) {
    try {
        $downloadsSize = (Get-ChildItem -Path $downloadsPath -Recurse -File -ErrorAction SilentlyContinue | 
            Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        if ($null -eq $downloadsSize) { $downloadsSize = 0 }
        $downloadsSizeKB = [math]::Round($downloadsSize / 1KB, 2)
    } catch {
        $downloadsSizeKB = 0
    }
} else {
    $downloadsSizeKB = 0
}

$results += [PSCustomObject]@{
    id = 'downloads'
    name = 'Downloads Folder'
    path = '%USERPROFILE%\Downloads'
    size = $downloadsSizeKB
}

# Output as JSON
$results | ConvertTo-Json -Compress
