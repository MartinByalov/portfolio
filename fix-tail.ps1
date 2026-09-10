$path = 'C:\Users\MartinByalov\Documents\GitHub\platform\tools\geometry\index.html'
$lines = Get-Content $path

# Locate the stray block: find the line after board-status close that is '    ' (4 spaces)
# and the run of </div> below it, ending just before </main>
$mainIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*</main>$') { $mainIdx = $i; break }
}
if ($mainIdx -lt 0) { Write-Host 'NO MAIN'; exit 1 }

# Find the last legit </div> before the 4-space junk line: scan upward from mainIdx
$keepEnd = $mainIdx
for ($i = $mainIdx - 1; $i -ge 0; $i--) {
    if ($lines[$i] -match '^ {8}</div>$') { $keepEnd = $i; break }
}

$newLines = @()
for ($i = 0; $i -le $keepEnd; $i++) { $newLines += $lines[$i] }
$newLines += '    </section>'
$newLines += ''
$newLines += '</div>'
$newLines += ''
$newLines += '</div>'
$newLines += ''
$newLines += '</main>'
for ($i = $mainIdx + 1; $i -lt $lines.Count; $i++) { $newLines += $lines[$i] }

Set-Content -Path $path -Value $newLines -Encoding UTF8
Write-Host '=== Tail fixed ==='
Write-Host "kept up to line $($keepEnd + 1), main was at $($mainIdx + 1)"