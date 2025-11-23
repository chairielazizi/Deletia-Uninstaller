param($OutputFile)

$ErrorActionPreference = 'SilentlyContinue'

$paths = @(
  "HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
  "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
  "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*"
)

$apps = $paths | ForEach-Object {
  Get-ItemProperty $_ -ErrorAction SilentlyContinue
} | Where-Object { $_.DisplayName -and $_.UninstallString } | 
Select-Object DisplayName, DisplayIcon, UninstallString, InstallDate, Publisher, DisplayVersion, EstimatedSize, PSChildName |
Sort-Object DisplayName -Unique

# Use .NET StreamWriter for UTF8 without BOM (compatible with all PowerShell versions)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

if (!$apps) {
    [System.IO.File]::WriteAllText($OutputFile, '[]', $utf8NoBom)
} else {
    $json = @($apps) | ConvertTo-Json -Depth 2
    [System.IO.File]::WriteAllText($OutputFile, $json, $utf8NoBom)
}
