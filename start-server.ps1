Write-Host "=== MODA CENTER - NEXT SERVER (PORTA 3001) ==="
Write-Host "Horario: $(Get-Date -Format 'HH:mm:ss')"
Write-Host "Logs em: server.log"
Write-Host "============================================="

$ErrorActionPreference = "Continue"

Set-Location $PSScriptRoot

$logPath = Join-Path $PSScriptRoot "server.log"
"[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Iniciando Next.js dev server (porta 3001)..." | Out-File -FilePath $logPath -Encoding utf8

$env:NODE_ENV = "development"
$env:PORT = "3001"

& node .\node_modules\next\dist\bin\next dev -p 3001 *>&1 | ForEach-Object {
    $line = $_
    Write-Host $line
    "[$(Get-Date -Format 'HH:mm:ss')] $line" | Out-File -FilePath $logPath -Append -Encoding utf8
}

Write-Host "=== PROCESSO FINALIZADO ===" | Out-File -FilePath $logPath -Append -Encoding utf8
