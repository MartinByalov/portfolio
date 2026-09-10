$ErrorActionPreference = 'Continue'
$dest = 'C:\Users\MartinByalov\Documents\GitHub\platform\assets\it-8-1'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

function Download-Url([string]$Url, [string]$File) {
    $out = Join-Path $dest $File
    if (Test-Path $out) {
        $len = (Get-Item $out).Length
        if ($len -gt 20000) { Write-Host "SKIP: $File (exists, $len bytes)"; return }
        Remove-Item $out -Force
    }
    try {
        $resp = Invoke-WebRequest -Uri $Url -TimeoutSec 120 -Headers @{ 'User-Agent' = $ua } -UseBasicParsing -MaximumRedirection 10
        if ($resp.StatusCode -eq 200) {
            [System.IO.File]::WriteAllBytes($out, $resp.Content)
            if ((Get-Item $out).Length -gt 20000) { Write-Host "OK: $File ($(Get-Item $out).Length bytes)" } else { Write-Host "BAD: $File (too small)"; Remove-Item $out -Force }
        } else { Write-Host "HTTP $($resp.StatusCode): $File" }
    } catch { Write-Host "FAIL: $File - $($_.Exception.Message)" }
}

Write-Host '=== Downloading Windows 11 (original) ==='

# Direct original file from the Commons API response
$urlOriginal = 'https://upload.wikimedia.org/wikipedia/commons/1/15/VirtualBox_Windows_11_24H2_%28Version_10.0.26100.1742.240906-0331%29_04_02_2025_17_34_35.png'
$urlThumb1600 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/VirtualBox_Windows_11_24H2_%28Version_10.0.26100.1742.240906-0331%29_04_02_2025_17_34_35.png/1600px-VirtualBox_Windows_11_24H2_%28Version_10.0.26100.1742.240906-0331%29_04_02_2025_17_34_35.png'
$urlThumb1920 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/VirtualBox_Windows_11_24H2_%28Version_10.0.26100.1742.240906-0331%29_04_02_2025_17_34_35.png/1920px-VirtualBox_Windows_11_24H2_%28Version_10.0.26100.1742.240906-0331%29_04_02_2025_17_34_35.png'

Download-Url $urlThumb1920 'windows11.jpg'
if (-not (Test-Path "$dest\windows11.jpg") -or (Get-Item "$dest\windows11.jpg").Length -lt 20000) {
    Download-Url $urlOriginal 'windows11.jpg'
}

Write-Host '=== Done ==='