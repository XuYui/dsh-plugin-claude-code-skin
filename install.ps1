# Install dsh-plugin-claude-code-skin into a dsh profile.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -Profile web
#
# It only touches the profile directory:
#   1. links this package into <profile>/node_modules
#   2. appends the bundle name to <profile>/package.json dsh.profile.bundles
#   3. backs both the manifest and the patch file up first (…bak-claude-code-skin)
#
# No dsh installation file is modified, and nothing outside the profile is read.

[CmdletBinding()]
param(
  [string]$Profile = 'desktop',
  [string]$ProfileRoot = $(if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME '.dsh' })
)

$ErrorActionPreference = 'Stop'

$packageDir = $PSScriptRoot
$manifest = Get-Content -LiteralPath (Join-Path $packageDir 'package.json') -Raw | ConvertFrom-Json
$packageName = $manifest.name
$profileDir = Join-Path (Join-Path $ProfileRoot 'profiles') $Profile
$profileManifestPath = Join-Path $profileDir 'package.json'
$profilePatchPath = Join-Path $profileDir 'cordis.patch.yml'

if (-not (Test-Path -LiteralPath $profileManifestPath)) {
  throw "dsh profile not found: $profileDir"
}

foreach ($file in @($profileManifestPath, $profilePatchPath)) {
  if (-not (Test-Path -LiteralPath $file)) { continue }
  $backup = "$file.bak-claude-code-skin"
  if (-not (Test-Path -LiteralPath $backup)) { Copy-Item -LiteralPath $file -Destination $backup }
}

# 1. node_modules link
$nodeModules = Join-Path $profileDir 'node_modules'
New-Item -ItemType Directory -Force -Path $nodeModules | Out-Null
$linkPath = Join-Path $nodeModules $packageName
if (Test-Path -LiteralPath $linkPath) {
  $item = Get-Item -LiteralPath $linkPath -Force
  if ($item.LinkType -ne 'Junction') {
    throw "$linkPath already exists and is not a junction; remove it first"
  }
  if ($item.Target -eq $packageDir) {
    Write-Host "already linked $linkPath"
  } else {
    # Remove-Item misbehaves on junctions in Windows PowerShell 5.1; rmdir only
    # unlinks the reparse point and never touches the target directory.
    & cmd.exe /c rmdir "$linkPath"
    if ($LASTEXITCODE -ne 0) { throw "could not unlink $linkPath" }
    New-Item -ItemType Junction -Path $linkPath -Target $packageDir | Out-Null
    Write-Host "relinked $linkPath"
  }
} else {
  New-Item -ItemType Junction -Path $linkPath -Target $packageDir | Out-Null
  Write-Host "linked $linkPath"
}

# 2. bundle selection
$profile = Get-Content -LiteralPath $profileManifestPath -Raw | ConvertFrom-Json
if (-not $profile.dsh) { $profile | Add-Member -NotePropertyName dsh -NotePropertyValue ([pscustomobject]@{}) -Force }
if (-not $profile.dsh.profile) { $profile.dsh | Add-Member -NotePropertyName profile -NotePropertyValue ([pscustomobject]@{}) -Force }
$bundles = @()
if ($profile.dsh.profile.bundles) { $bundles = @($profile.dsh.profile.bundles) }
$changed = $bundles -notcontains $packageName
if ($changed) { $bundles += $packageName }
$profile.dsh.profile | Add-Member -NotePropertyName bundles -NotePropertyValue $bundles -Force

$json = $profile | ConvertTo-Json -Depth 12
[System.IO.File]::WriteAllText($profileManifestPath, $json + [Environment]::NewLine, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "updated $profileManifestPath (bundle selection)"

# 3. sanity check: the bundle must resolve from the profile anchor
$probe = Join-Path $linkPath 'package.json'
if (-not (Test-Path -LiteralPath $probe)) { throw "bundle did not resolve: $probe" }

Write-Host ''
Write-Host 'Installed. The Desktop profile reloads live while HMR is enabled;'
Write-Host 'if the sidebar still says "deepseek HARNESS", press Ctrl+R in the window.'
