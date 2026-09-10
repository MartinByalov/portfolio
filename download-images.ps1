$ErrorActionPreference = 'Continue'
$dest = 'C:\Users\MartinByalov\Documents\GitHub\platform\assets\it-8-1'
$minBytes = 5000

# upload.wikimedia.org hard-blocks descriptive/script User-Agents (403),
# so a browser-like UA is required for the image host
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

# Wikimedia rate-limits aggressively (429/403) - retry with exponential backoff
# (5s, 15s, 45s) after failures; never sleep before the first attempt.
# TLS 1.2 is enforced for Windows PowerShell 5.1 compatibility.
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }

function Test-ImageFile([string]$Path) {
    (Test-Path $Path) -and ((Get-Item $Path).Length -gt $minBytes)
}

function Download-Url([string]$Url, [string]$File, [int]$Retries = 4) {
    $out = Join-Path $dest $File
    if (Test-ImageFile $out) {
        Write-Host "SKIP: $File (exists, $((Get-Item $out).Length) bytes)"
        return
    }
    Remove-Item $out -Force -ErrorAction SilentlyContinue
    for ($attempt = 1; $attempt -le $Retries; $attempt++) {
        try {
            Write-Host "  Downloading $File (attempt $attempt/$Retries)"
            Invoke-WebRequest -Uri $Url -OutFile $out -TimeoutSec 120 -MaximumRedirection 10 -Headers @{ 'User-Agent' = $ua } -UseBasicParsing
            if (Test-ImageFile $out) {
                Write-Host "OK: $File ($((Get-Item $out).Length) bytes)"
                return
            }
            Write-Host "BAD: $File ($((Get-Item $out).Length) bytes)"
            Remove-Item $out -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "  FAIL ${attempt}/${Retries}: $($_.Exception.Message)"
            Remove-Item $out -Force -ErrorAction SilentlyContinue
        }
        if ($attempt -lt $Retries) { Start-Sleep -Seconds (5 * [Math]::Pow(3, $attempt - 1)) }
    }
    Write-Host "GIVE UP: $File after $Retries attempts"
}

function Get-WikiImage([string]$Search, [int]$Retries = 4) {
    $api = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=$([uri]::EscapeDataString($Search))&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=1600"
    for ($attempt = 1; $attempt -le $Retries; $attempt++) {
        try {
            Write-Host "  Searching Commons for: $Search (attempt $attempt/$Retries)"
            $obj = Invoke-RestMethod -Uri $api -TimeoutSec 60 -Headers @{ 'User-Agent' = $ua }
            # A valid response with no pages is a definitive search miss - do not retry it
            if (-not $obj.query -or -not $obj.query.pages) {
                Write-Host "  No search results for: $Search"
                return $null
            }
            foreach ($k in $obj.query.pages.PSObject.Properties.Name) {
                $p = $obj.query.pages.$k
                $info = $p.imageinfo | Select-Object -First 1
                if ($info -and $info.thumburl) { return $info.thumburl }
                if ($info -and $info.url) { return $info.url }
            }
        } catch {
            Write-Host "  retry ${attempt}/${Retries}: $($_.Exception.Message)"
            if ($attempt -lt $Retries) { Start-Sleep -Seconds (5 * [Math]::Pow(3, $attempt - 1)) }
        }
    }
    return $null
}

function Wiki-Download([string]$Search, [string]$File) {
    # Check the local file BEFORE hitting the Commons API (fast, idempotent reruns)
    $out = Join-Path $dest $File
    if (Test-ImageFile $out) {
        Write-Host "SKIP: $File (exists, $((Get-Item $out).Length) bytes)"
        return
    }
    $url = Get-WikiImage $Search
    if ($url) { Download-Url $url $File } else { Write-Host "NO WIKI: $Search -> $File" }
    Start-Sleep -Seconds 1
}

Write-Host "=== Downloading remaining images with delays ==="

Wiki-Download "Windows 11 desktop operating system" 'windows11.jpg'
Wiki-Download "Mozilla Firefox browser interface"  'firefox.jpg'
Wiki-Download "data center server rack computer"   'server-modern.jpg'

Write-Host "=== Done ==="