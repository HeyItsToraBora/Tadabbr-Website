# Simple PowerShell HTTP Server for Tadabbr Frontend
$port = 8000
$root = Get-Location

Write-Host "Starting Tadabbr Frontend Server..." -ForegroundColor Green
Write-Host "Server running at: http://localhost:$port" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $url = $request.Url.LocalPath
        if ($url -eq "/") {
            $url = "/home.html"
        }

        $filePath = Join-Path $root $url.TrimStart("/")
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $extension = [System.IO.Path]::GetExtension($filePath)
            
            switch ($extension) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".js" { $contentType = "application/javascript; charset=utf-8" }
                ".css" { $contentType = "text/css; charset=utf-8" }
                ".json" { $contentType = "application/json; charset=utf-8" }
                default { $contentType = "text/plain; charset=utf-8" }
            }
            
            $response.ContentType = $contentType
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $notFound = "404 - File not found: $url"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
        
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $url" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
} 