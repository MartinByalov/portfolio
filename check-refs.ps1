$jsonPath = 'C:\Users\MartinByalov\Documents\GitHub\platform\lessons\it-8\it-8-1.json'
$root = 'C:\Users\MartinByalov\Documents\GitHub\platform'
$refs = Select-String -Path $jsonPath -Pattern '/assets/[^"]+' -AllMatches | ForEach-Object { $_.Matches.Value } | Sort-Object -Unique
foreach ($r in $refs) {
    $f = $root + ($r -replace '/', '\')
    if (Test-Path $f) { Write-Host "OK: $r" } else { Write-Host "MISSING: $r" }
}
Write-Host '=== Check done ==='