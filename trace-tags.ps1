$c = Get-Content 'C:\Users\MartinByalov\Documents\GitHub\platform\tools\geometry\index.html'
for ($i = 0; $i -lt $c.Count; $i++) {
    $t = $c[$i]
    $n = ($i + 1).ToString().PadLeft(4)
    if ($t -match '<div[\s>]') { Write-Host ("OPEN  div  " + $n + ": " + $t.Trim()) }
    elseif ($t -match '</div>') { Write-Host ("CLOSE div  " + $n + ": " + $t.Trim()) }
    elseif ($t -match '<section|</section>') { Write-Host ("SECT       " + $n + ": " + $t.Trim()) }
}