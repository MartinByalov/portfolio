# Създава примерни epub книги за инструмента "БДС Клавиатура" (tools/bds/books).
$ErrorActionPreference = 'Stop'
$booksDir = Join-Path $PSScriptRoot 'books'
New-Item -ItemType Directory -Force -Path $booksDir | Out-Null

$container = @'
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
'@

function Make-Epub($fileName, $bookTitle, $author, $chapters) {
    $tmp = Join-Path $env:TEMP ("epub_" + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Force -Path (Join-Path $tmp 'META-INF') | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $tmp 'OEBPS') | Out-Null

    [IO.File]::WriteAllText((Join-Path $tmp 'mimetype'), 'application/epub+zip')
    [IO.File]::WriteAllText((Join-Path $tmp 'META-INF\container.xml'), $container)

    $manifestItems = ''
    $spineItems = ''
    for ($i = 0; $i -lt $chapters.Count; $i++) {
        $id = "ch$($i + 1)"
        $href = "ch$($i + 1).xhtml"
        $xhtml = @"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="bg">
<head><meta charset="utf-8"/><title>$($chapters[$i][0])</title></head>
<body><h2>$($chapters[$i][0])</h2>
<p>$($chapters[$i][1])</p>
</body></html>
"@
        [IO.File]::WriteAllText((Join-Path $tmp "OEBPS\$href"), $xhtml)
        $manifestItems += "    <item id=`"$id`" href=`"$href`" media-type=`"application/xhtml+xml`"/>`n"
        $spineItems += "    <itemref idref=`"$id`"/>`n"
    }

    $opf = @"
<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">urn:uuid:$([guid]::NewGuid())</dc:identifier>
    <dc:title>$bookTitle</dc:title>
    <dc:creator>$author</dc:creator>
    <dc:language>bg</dc:language>
  </metadata>
  <manifest>
$manifestItems  </manifest>
  <spine>
$spineItems  </spine>
</package>
"@
    [IO.File]::WriteAllText((Join-Path $tmp 'OEBPS\content.opf'), $opf)

    $out = Join-Path $booksDir $fileName
    if (Test-Path $out) { Remove-Item $out -Force }
    Compress-Archive -Path (Join-Path $tmp '*') -DestinationPath ($out + '.zip') -Force
    Move-Item ($out + '.zip') $out -Force
    Remove-Item $tmp -Recurse -Force
    Write-Host "Създадена: $out"
}

$computerChapters = @(
    @('Глава 1. Писмото', 'Една сутрин Мартин намерил в пощенската кутия писмо. В него имало покана за рождения ден на приятел му. Той бързо облякъл якето си, взел подаръка и тръгнал по улицата. Писмото било написано на красива картичка, въпреки че почеркът бил по-особен. Децата купили подарък и нетърпеливо развързали пакета. В него имаше музикална кутийка.'),
    @('Глава 2. Компютърната зала', 'В компютърната зала седнали тридесет ученици. Учителката включила проектора и показала новата програма. Всички отворили редактора и започнали да пишат първите си редове код. Когато програмата тръгнала, залата изпълни с радост. Никой не искал да прекъсне работата си дори по време на почивката.'),
    @('Глава 3. Клавиатурата', 'Клавиатурата е най-важният инструмент на ученика в час по информатика. Всяка буква има своето място, както всеки ученик има своето място в класа. Когато пишеш бързо и точно, мислите ти текат свободно. Затова си струва да отделиш време за тренировка всеки ден.'),
    @('Глава 4. Мрежата', 'Училищната мрежа свързва всички компютри в една обща система. През нея минават писма, страници и файлове. Мрежата е като пътищата на един град — колкото повече връзки, толкова по-бързо стигаш до целта си. Но пътищата изискват и внимание, и отговорност.'),
    @('Глава 5. Празника', 'На празника на училището залата била пълна. Децата показали своите проекти: игри, страници и малки роботи. Родителите аплодирали дълго. В края директорът казал, че технологиите са само инструмент, а истинската стойност е в хората, които ги използват за добро.')
)

$networkChapters = @(
    @('Откъс 1. Малката мрежа', 'В малкото село нямало интернет, но децата имали мечти. Те събирали стари компютри и ги възстановявали след час. Един ден учителът донесъл роутер и създал първата местна мрежа. Децата писали писма едно на друго и играта станала истинска магия.'),
    @('Откъс 2. Сървърът в килера', 'Старият компютър в килера станал първия сървър на селото. Той пазел страници, снимки и малка енциклопедия. Всеки ученик имал своето място в него. Когато токът спрял, децата запазили данните и после ги възстановили изцяло.'),
    @('Откъс 3. Първата страница', 'Първата страница на селото била проста: заглавие, снимка и кратък текст. Но тя свързала хората с целия свят. Заловили се за клавиатурите и писали с радост. Страницата пораснала бързо, както расте младо дърво след дъжд.'),
    @('Откъс 4. Сигурността', 'Учителът обяснил, че мрежата е като къща: вратите трябва да се заключват. Паролите станали дълги и различни, а backups редовни. Децата научили и друг урок — отговорността към чуждите данни е такава, каквато е към чуждото имущество.')
)

Make-Epub 'razkazi-za-kompyutara.epub' 'Разкази за компютъра' 'Мартин Бялов' $computerChapters
Make-Epub 'priklucheniya-v-mrezhata.epub' 'Приключения в мрежата' 'Мартин Бялов' $networkChapters

$booksJson = @(
    @{ title = 'Разкази за компютъра'; file = 'books/razkazi-za-kompyutara.epub' },
    @{ title = 'Приключения в мрежата'; file = 'books/priklucheniya-v-mrezhata.epub' }
) | ConvertTo-Json
[IO.File]::WriteAllText((Join-Path $booksDir 'books.json'), $booksJson)
Write-Host 'Създаден: books.json'
