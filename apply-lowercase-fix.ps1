# Fixes the ghcr.io "repository name must be lowercase" build failure.
# Run from your FRESH clone:
#   cd C:\Users\tatva\Projects\voice-of-kingdom-all
#   .\apply-lowercase-fix.ps1

$ErrorActionPreference = "Stop"

function Run($desc, [scriptblock]$block) {
    Write-Host "==> $desc" -ForegroundColor Cyan
    & $block
    if ($LASTEXITCODE -ne 0) { throw "failed: $desc" }
}

$bundle = "lowercase-fix.bundle"
if (-not (Test-Path $bundle)) {
    Write-Host "Run this from the repo root, next to $bundle" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path ".git")) {
    Write-Host "This is not a git repository root." -ForegroundColor Red
    exit 1
}

Run "verifying bundle" { git bundle verify $bundle }
Run "fetching on top of current develop" { git fetch $bundle develop:refs/heads/_lowercasefix }

$ahead = git rev-list --count _lowercasefix..develop
if ($ahead -ne 0) {
    Write-Host "Your local develop has $ahead commit(s) this bundle doesn't know about." -ForegroundColor Red
    git branch -D _lowercasefix
    exit 1
}

Run "checking out develop" { git checkout develop }
Run "fast-forwarding"       { git merge --ff-only _lowercasefix }
Run "cleaning up"           { git branch -D _lowercasefix }
Run "pushing develop"       { git push origin develop }

Run "checking out prod" { git checkout prod }
Run "merging develop"   { git merge develop }
Run "pushing prod (retriggers the deploy)" { git push origin prod }

Write-Host ""
Write-Host "Pushed. The deploy workflow is running again -- check the Actions tab." -ForegroundColor Green
