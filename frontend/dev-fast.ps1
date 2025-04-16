# Performance optimization script for React development server
Write-Host "Starting high-performance development mode..." -ForegroundColor Cyan

# Check if process runs already
function Stop-ProcessIfRunning($processName) {
    $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "Stopping existing $processName processes..." -ForegroundColor Yellow
        Stop-Process -Name $processName -Force
        Start-Sleep -Seconds 1
    }
}

# Clean temporary files
Write-Host "Cleaning temporary files..." -ForegroundColor Magenta
if (Test-Path node_modules/.cache) {
    Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
}

# Build CSS once
Write-Host "Building CSS once..." -ForegroundColor Blue
npm run build:css

# Set additional environment variables for the current process
$env:BROWSER = "none" # Prevents browser from opening automatically
$env:TSC_COMPILE_ON_ERROR = "true" # Continue despite TypeScript errors
$env:DISABLE_ESLINT_PLUGIN = "true" # Disable ESLint during development

# First start the CSS watcher in background
Write-Host "Starting CSS watcher in background..." -ForegroundColor Green
$tailwindProcess = Start-Process powershell -ArgumentList "-Command npm run watch:css" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden

try {
    # Start development server with optimized settings
    Write-Host "Starting optimized development server..." -ForegroundColor Yellow
    npm run start:fast
}
finally {
    # Clean up background processes
    if ($null -ne $tailwindProcess) {
        Stop-Process -Id $tailwindProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped Tailwind CSS watcher" -ForegroundColor DarkGray
    }
} 