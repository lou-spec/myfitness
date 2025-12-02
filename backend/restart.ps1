# Script para reiniciar o servidor backend
Write-Host "🔄 Reiniciando servidor backend..." -ForegroundColor Cyan

# Parar processos node existentes (opcional - cuidado se tiver outros processos node)
# Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Navegar para pasta backend
Set-Location -Path "c:\projeto\backend"

# Verificar se .env existe
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
    
    # Mostrar variáveis de email (sem mostrar senha completa)
    $envContent = Get-Content ".env"
    foreach ($line in $envContent) {
        if ($line -like "EMAIL_*") {
            if ($line -like "EMAIL_PASS=*") {
                Write-Host "  $($line.Substring(0, 11))********" -ForegroundColor Yellow
            } else {
                Write-Host "  $line" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "`n🚀 Iniciando servidor..." -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar`n" -ForegroundColor Gray

# Iniciar servidor
npm start
