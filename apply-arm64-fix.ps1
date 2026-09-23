# Applies the ARM64 build fix (deploy.yml + ci.yml) and pushes to develop.
#
# Run this from your FRESH clone (not the old OneDrive folder):
#   cd C:\Users\tatva\Projects\voice-of-kingdom-all
#   .\apply-arm64-fix.ps1
#
# This is a tiny, single-commit fast-forward -- no resets, no deletions.

$ErrorActionPreference = "Stop"

function Run($desc, [scriptblock]$block) {
    Write-Host "==> $desc" -ForegroundColor Cyan
    & $block
    if ($LASTEXITCODE -ne 0) { throw "failed: $desc" }
}

$bundle = "arm64-fix.bundle"
if (-not (Test-Path $bundle)) {
    Write-Host "Run this from the repo root, next to $bundle" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path ".git")) {
    Write-Host "This is not a git repository root." -ForegroundColor Red
    exit 1
}

Run "verifying bundle"  { git bundle verify $bundle }
Run "fetching on top of current develop" { git fetch $bundle develop:refs/heads/_arm64fix }

$behind = git rev-list --count develop.._arm64fix
$ahead  = git rev-list --count _arm64fix..develop
if ($ahead -ne 0) {
    Write-Host "Your local develop has $ahead commit(s) this bundle doesn't know about." -ForegroundColor Red
    Write-Host "Stop and check before continuing -- this script expects a clean fast-forward." -ForegroundColor Red
    git branch -D _arm64fix
    exit 1
}

Run "checking out develop"           { git checkout develop }
Run "fast-forwarding ($behind commit(s))" { git merge --ff-only _arm64fix }
Run "cleaning up temp branch"        { git branch -D _arm64fix }
Run "pushing"                        { git push origin develop }

Write-Host ""
Write-Host "Pushed. develop now builds linux/arm64 images for the deploy step." -ForegroundColor Green
Write-Host ""
Write-Host "When you're ready to ship, merge into prod:" -ForegroundColor Cyan
Write-Host "  git checkout prod"
Write-Host "  git merge develop"
Write-Host "  git push origin prod"
