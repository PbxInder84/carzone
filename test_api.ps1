# Test API endpoints using PowerShell
Write-Host "Testing API Health Endpoint..." -ForegroundColor Cyan

# Health endpoint
$healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -ErrorAction SilentlyContinue
if ($healthResponse) {
    Write-Host "Health Check Successful: $($healthResponse | ConvertTo-Json -Depth 1)" -ForegroundColor Green
} else {
    Write-Host "Health Check Failed" -ForegroundColor Red
}

# Test an invalid endpoint to generate an error
Write-Host "`nTesting Invalid Endpoint (to generate 404 error log)..." -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/nonexistent" -Method Get -ErrorAction Stop
} catch {
    Write-Host "Expected 404 Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Pause before checking logs
Start-Sleep -Seconds 2

# Check if logs directory was created and log files exist
Write-Host "`nChecking Log Files..." -ForegroundColor Cyan
$logDir = Join-Path $PSScriptRoot "logs"
if (Test-Path $logDir) {
    Write-Host "Log directory exists at: $logDir" -ForegroundColor Green
    $logFiles = Get-ChildItem -Path $logDir -Filter "*.log"
    
    if ($logFiles.Count -gt 0) {
        Write-Host "Found $($logFiles.Count) log files:" -ForegroundColor Green
        $logFiles | ForEach-Object {
            Write-Host "- $($_.Name) (Size: $([math]::Round($_.Length/1KB, 2)) KB)" -ForegroundColor Green
            
            # Display the first few lines of each log file
            Write-Host "`nFirst 5 lines of $($_.Name):" -ForegroundColor Cyan
            Get-Content $_.FullName -Head 5 | ForEach-Object {
                Write-Host "  $_" -ForegroundColor Gray
            }
            Write-Host ""
        }
    } else {
        Write-Host "No log files found in the logs directory." -ForegroundColor Yellow
    }
} else {
    Write-Host "Log directory was not created at: $logDir" -ForegroundColor Red
} 