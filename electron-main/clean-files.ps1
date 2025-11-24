# Clean-Files.ps1
# Deletes cleanable files based on provided IDs

param(
    [Parameter(Mandatory=$true)]
    [string[]]$ItemIds
)

$results = @{
    success = $true
    cleaned = @()
    errors = @()
}

foreach ($id in $ItemIds) {
    try {
        switch ($id) {
            'temp' {
                $tempPath = $env:TEMP
                if (Test-Path $tempPath) {
                    Get-ChildItem -Path $tempPath -Recurse -File -ErrorAction SilentlyContinue | 
                        Remove-Item -Force -ErrorAction SilentlyContinue
                    Get-ChildItem -Path $tempPath -Recurse -Directory -ErrorAction SilentlyContinue | 
                        Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
                    $results.cleaned += $id
                }
            }
            'wintemp' {
                $winTempPath = "$env:SystemRoot\Temp"
                if (Test-Path $winTempPath) {
                    Get-ChildItem -Path $winTempPath -Recurse -File -ErrorAction SilentlyContinue | 
                        Remove-Item -Force -ErrorAction SilentlyContinue
                    Get-ChildItem -Path $winTempPath -Recurse -Directory -ErrorAction SilentlyContinue | 
                        Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
                    $results.cleaned += $id
                }
            }
            'prefetch' {
                $prefetchPath = "$env:SystemRoot\Prefetch"
                if (Test-Path $prefetchPath) {
                    Get-ChildItem -Path $prefetchPath -File -Filter "*.pf" -ErrorAction SilentlyContinue | 
                        Remove-Item -Force -ErrorAction SilentlyContinue
                    $results.cleaned += $id
                }
            }
            'recyclebin' {
                Clear-RecycleBin -Force -ErrorAction SilentlyContinue
                $results.cleaned += $id
            }
            'downloads' {
                # NOTE: This is dangerous - user should be very careful
                # Only delete if explicitly requested
                $downloadsPath = "$env:USERPROFILE\Downloads"
                if (Test-Path $downloadsPath) {
                    Get-ChildItem -Path $downloadsPath -Recurse -File -ErrorAction SilentlyContinue | 
                        Remove-Item -Force -ErrorAction SilentlyContinue
                    Get-ChildItem -Path $downloadsPath -Recurse -Directory -ErrorAction SilentlyContinue | 
                        Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
                    $results.cleaned += $id
                }
            }
        }
    } catch {
        $results.errors += @{
            id = $id
            error = $_.Exception.Message
        }
    }
}

if ($results.errors.Count -gt 0) {
    $results.success = $false
}

$results | ConvertTo-Json -Compress
