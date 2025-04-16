# Fast start script - no fancy characters, just direct commands
Write-Host "Starting fast development environment..." -ForegroundColor Green

# Kill any existing node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Killing node process with ID: $($_.Id)" -ForegroundColor Yellow
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# Clean cache
if (Test-Path node_modules/.cache) {
    Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
    Write-Host "Cleared node_modules/.cache" -ForegroundColor Green
}

# Set performance environment variables
$env:BROWSER = "none"
$env:GENERATE_SOURCEMAP = "false"
$env:FAST_REFRESH = "true"
$env:SKIP_PREFLIGHT_CHECK = "true"
$env:TSC_COMPILE_ON_ERROR = "true"
$env:DISABLE_ESLINT_PLUGIN = "true"

# Build CSS first (once)
npm run build:css

# Start the server in fast mode
npm run start:fast 