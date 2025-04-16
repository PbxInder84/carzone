# ===== React Development Tools =====

# Function to clean the development environment
function Clean-ReactEnv {
    Write-Host "Cleaning development environment..." -ForegroundColor Cyan
    
    # Remove cache directories
    if (Test-Path node_modules/.cache) {
        Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
        Write-Host "Cleared node_modules/.cache" -ForegroundColor Green
    }
    
    # Clean output.css file
    if (Test-Path src/output.css) {
        Remove-Item -Force src/output.css -ErrorAction SilentlyContinue
        Write-Host "Removed output.css" -ForegroundColor Green
    }
    
    # Remove build directory
    if (Test-Path build) {
        Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
        Write-Host "Removed build directory" -ForegroundColor Green
    }
    
    # Clean npm cache (optional)
    Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
    npm cache clean --force
    Write-Host "NPM cache cleaned" -ForegroundColor Green
}

# Function to kill stray node processes that might interfere with development
function Kill-NodeProcesses {
    Write-Host "Terminating node processes..." -ForegroundColor Magenta
    Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "   Killing node process with ID: $($_.Id)" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Node processes terminated" -ForegroundColor Green
}

# Function to restart the development environment from scratch
function Restart-DevEnvironment {
    Write-Host "Restarting development environment from scratch..." -ForegroundColor Cyan
    
    # Kill existing processes
    Kill-NodeProcesses
    
    # Clean environment
    Clean-ReactEnv
    
    # Build CSS once
    Write-Host "Building CSS..." -ForegroundColor Blue
    npm run build:css
    
    # Start optimized development server
    Write-Host "Starting optimized development server..." -ForegroundColor Green
    & $PSScriptRoot\dev-fast.ps1
}

# Export functions for use when dot-sourced
Export-ModuleMember -Function Clean-ReactEnv, Kill-NodeProcesses, Restart-DevEnvironment

# Show available commands
Write-Host "`nAvailable commands (dot-source this script first):" -ForegroundColor Cyan
Write-Host "   Clean-ReactEnv        - Clean the development environment" -ForegroundColor White
Write-Host "   Kill-NodeProcesses    - Kill all running node processes" -ForegroundColor White
Write-Host "   Restart-DevEnvironment - Completely restart the dev environment" -ForegroundColor White
Write-Host "`nUsage: . .\dev-tools.ps1; Restart-DevEnvironment" -ForegroundColor Yellow 