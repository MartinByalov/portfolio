const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

// Find the node
let targetContent = data.components[0].items[0].content.find(c => c.id === 'file-extensions-explanation-sub').content[0];

// Replace backticks with bold tags
targetContent.content = "Файловете могат да се откриват по име или по файлово разширение. Разширението показва типа на файла (напр. <b>.docx</b> за документ, <b>.jpg</b> за изображение, <b>.pptx</b> за презентация, <b>.pdf</b> за PDF файл):<br><br>• <b>report</b> – намира файлове, чието име съдържа думата <i>report</i>.<br>• <b>.jpg</b> – намира изображения от тип JPG.<br>• <b>*.pptx</b> – намира презентации на PowerPoint.";

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Replaced backticks with bolding');
