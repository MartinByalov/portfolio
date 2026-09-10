$jsonPath = 'C:\Users\MartinByalov\Documents\GitHub\platform\lessons\it-8\it-8-1.json'

Write-Host '=== 1. Провайдър / доставчик ==='
Select-String -Path $jsonPath -Pattern 'Провайдър|доставчик' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }

Write-Host ''
Write-Host '=== 2. Orange formula text should be GONE ==='
$found = Select-String -Path $jsonPath -Pattern 'Компютърна система = Хардуер'
if ($found) { $found | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" } } else { Write-Host 'GONE (good)' }

Write-Host ''
Write-Host '=== 3. Fragment check ==='
$content = Get-Content $jsonPath -Raw

Write-Host '--- 3a. windows11 usage count:'
($content | Select-String -Pattern 'windows11' -AllMatches).Matches.Count
Write-Host '--- 3b. linux-modern usage:'
($content | Select-String -Pattern 'linux-modern' -AllMatches).Matches.Count
Write-Host '--- 3c. photoshop usage:'
($content | Select-String -Pattern 'photoshop' -AllMatches).Matches.Count
Write-Host '--- 3d. word-modern usage:'
($content | Select-String -Pattern 'word-modern' -AllMatches).Matches.Count
Write-Host '--- 3e. project-work-vector usage:'
($content | Select-String -Pattern 'project-work-vector' -AllMatches).Matches.Count
Write-Host '--- 3f. packet-journey usage:'
($content | Select-String -Pattern 'packet-journey' -AllMatches).Matches.Count

Write-Host '=== Done ==='