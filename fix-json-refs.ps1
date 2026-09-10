$ErrorActionPreference = 'Stop'
$path = 'C:\Users\MartinByalov\Documents\GitHub\platform\lessons\it-8\it-8-1.json'
$content = Get-Content -Path $path -Raw -Encoding UTF8

$map = @{
    '/assets/it-8-1/modern-motherboard-modern.jpg' = '/assets/it-8-1/motherboard-modern.jpg'
    '/assets/it-8-1/modern-cpu-modern.jpg'         = '/assets/it-8-1/cpu-modern.jpg'
    '/assets/it-8-1/modern-ram-modern.jpg'         = '/assets/it-8-1/ram-modern.jpg'
    '/assets/it-8-1/linux.jpg'                     = '/assets/it-8-1/linux-modern.jpg'
    '/assets/it-8-1/firefox-modern.jpg'            = '/assets/it-8-1/firefox.jpg'
    '/assets/it-8-1/microsoft-word-modern.jpg'     = '/assets/it-8-1/word-modern.jpg'
    '/assets/it-8-1/modern-program-code.jpg'       = '/assets/it-8-1/program-code.jpg'
    '/assets/it-8-1/computer-internal-config.jpg'  = '/assets/it-8-1/computer-inside.jpg'
    '/assets/it-8-1/working-software-visualization.jpg' = '/assets/it-8-1/application.jpg'
    '/assets/it-8-1/modern-cpu-closeup.jpg'        = '/assets/it-8-1/cpu-closeup.jpg'
    '/assets/it-8-1/modern-router-modern.jpg'      = '/assets/it-8-1/router-modern.jpg'
    '/assets/it-8-1/modern-server-modern.jpg'      = '/assets/it-8-1/server-modern.jpg'
    '/assets/it-8-1/internet-packet-journey.jpg'   = '/assets/it-8-1/packet-journey.jpg'
    '/assets/it-8-1/modern-excel-modern.jpg'       = '/assets/it-8-1/excel-modern.jpg'
    '/assets/it-8-1/google-chrome-modern.jpg'      = '/assets/it-8-1/chrome-modern.jpg'
    '/assets/it-8-1/modern-powerpoint-modern.jpg'  = '/assets/it-8-1/powerpoint-modern.jpg'
}

foreach ($key in $map.Keys) {
    if ($content.Contains($key)) {
        $content = $content.Replace($key, $map[$key])
        Write-Host "REPLACED: $key -> $($map[$key])"
    } else {
        Write-Host "NOT FOUND: $key"
    }
}

Set-Content -Path $path -Value $content -Encoding UTF8 -NoNewline
Write-Host '=== Save done ==='