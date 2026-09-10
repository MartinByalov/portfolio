$files = @(
    'C:\Users\MartinByalov\Documents\GitHub\platform\tools\geometry\geometry.html',
    'C:\Users\MartinByalov\Documents\GitHub\platform\tools\geometry\index.html'
)
foreach ($f in $files) {
    $c = Get-Content $f -Raw
    $divO = ([regex]::Matches($c, '<div[\s>]')).Count
    $divC = ([regex]::Matches($c, '</div>')).Count
    $secO = ([regex]::Matches($c, '<section[\s>]')).Count
    $secC = ([regex]::Matches($c, '</section>')).Count
    $mainO = ([regex]::Matches($c, '<main[\s>]')).Count
    $mainC = ([regex]::Matches($c, '</main>')).Count
    $svgO = ([regex]::Matches($c, '<svg[\s>]')).Count
    $svgC = ([regex]::Matches($c, '</svg>')).Count
    Write-Host "FILE: $f"
    Write-Host "  div: $divO open / $divC close"
    Write-Host "  section: $secO open / $secC close"
    Write-Host "  main: $mainO open / $mainC close"
    Write-Host "  svg: $svgO open / $svgC close"
    Write-Host ''
}