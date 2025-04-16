# Start Tailwind CSS watcher in background
$tailwindProcess = Start-Process powershell -ArgumentList "-Command npm run watch:css" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden

# Start React development server
try {
    Write-Host "Starting development server..." -ForegroundColor Green
    npm run start:fast
}
finally {
    # Make sure to stop the background process when the main process ends
    if ($tailwindProcess -ne $null) {
        Stop-Process -Id $tailwindProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped Tailwind CSS watcher" -ForegroundColor Yellow
    }
} 