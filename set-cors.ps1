# Script PowerShell para configurar CORS do Firebase Storage
# Criado para desenvolvimento local

Write-Host "Criando arquivo cors.json para Firebase Storage..." -ForegroundColor Green

# Conteúdo do arquivo cors.json
$corsConfig = @'
[
  {
    "origin": [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174"
    ],
    "method": ["GET","POST","PUT","HEAD","DELETE","OPTIONS"],
    "responseHeader": ["Content-Type","x-goog-resumable","Authorization","x-goog-meta-*"],
    "maxAgeSeconds": 3600
  }
]
'@

# Criar o arquivo cors.json
try {
    $corsConfig | Out-File -FilePath "cors.json" -Encoding UTF8
    Write-Host "✅ Arquivo cors.json criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
    Write-Host "1. Execute: gsutil cors set cors.json gs://ds-engenharia-84e9b.firebasestorage.app" -ForegroundColor Cyan
    Write-Host "2. Ou use o Firebase CLI: firebase storage:configure" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔧 Configuração aplicada:" -ForegroundColor Yellow
    Write-Host "- Origins: localhost:5173, 127.0.0.1:5173, localhost:5174, 127.0.0.1:5174" -ForegroundColor White
    Write-Host "- Métodos: GET, POST, PUT, HEAD, DELETE, OPTIONS" -ForegroundColor White
    Write-Host "- Headers: Content-Type, x-goog-resumable, Authorization, x-goog-meta-*" -ForegroundColor White
    Write-Host "- Cache: 3600 segundos (1 hora)" -ForegroundColor White
}
catch {
    Write-Host "❌ Erro ao criar arquivo cors.json: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📁 Arquivo criado em: $(Get-Location)\cors.json" -ForegroundColor Cyan
