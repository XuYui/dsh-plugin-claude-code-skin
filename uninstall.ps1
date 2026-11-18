# Remove dsh-plugin-claude-code-skin from this machine's Desktop profile.
#
#   pwsh -File uninstall.ps1
#
# Reverses install.ps1: drops the bundle selection, the dependency, and the
# node_modules link. Backups written by install.ps1 are left in place.

[CmdletBinding()]
param(
  [string]$Profile = 'desktop',
  [string]$ProfileRoot = $(if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME '.dsh' })
)

$ErrorActionPreference = 'Stop'
$packageDir = $PSScriptRoot
$packageJson = Get-Content -LiteralPath (Join-Path $packageDir 'package.json') -Raw | ConvertFrom-Json
$packageName = $packageJson.name
$profileDir = Join-Path (Join-Path $ProfileRoot 'profiles') $Profile
$manifestPath = Join-Path $profileDir 'package.json'

if (Test-Path -LiteralPath $manifestPath) {
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  if ($manifest.dsh.profile.bundles) {
    $bundles = @($manifest.dsh.profile.bundles) | Where-Object { $_ -ne $packageName }
    $manifest.dsh.profile | Add-Member -NotePropertyName bundles -NotePropertyValue $bundles -Force
  }
  if ($manifest.dependencies) {
    $manifest.dependencies.PSObject.Properties.Remove($packageName)
  }
  $json = $manifest | ConvertTo-Json -Depth 12
  [System.IO.File]::WriteAllText($manifestPath, $json + [Environment]::NewLine, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "cleaned $manifestPath"
}

$linkPath = Join-Path (Join-Path $profileDir 'node_modules') $packageName
if (Test-Path -LiteralPath $linkPath) {
  $item = Get-Item -LiteralPath $linkPath -Force
  if ($item.LinkType -eq 'Junction') {
    # rmdir removes only the reparse point; the package directory is untouched.
    & cmd.exe /c rmdir "$linkPath"
    Write-Host "removed $linkPath"
  }
}

Write-Host 'uninstalled. Reload the window (Ctrl+R) or restart DeepSeek Harness.'
