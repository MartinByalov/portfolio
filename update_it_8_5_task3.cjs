const fs = require('fs');
let json = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

const workbookSection = json.components.find(c => c.id === 'workbook-exercises-section');
if (workbookSection && workbookSection.items && workbookSection.items[0]) {
  const tasks = workbookSection.items[0].content;
  const task3Index = tasks.findIndex(t => t.id && t.id.includes('task3'));
  if (task3Index !== -1) {
    tasks[task3Index] = {
      "type": "interactive-matching",
      "mode": "scattered",
      "id": "wb-task3-matching-win11",
      "title": "Задача 3. Филтри за търсене във File Explorer на Windows 11",
      "pairs": [
        {
          "concept": "Време на създаване (Date Modified)",
          "definition": "Днес, Тази седмица"
        },
        {
          "concept": "Големина на файла (Size)",
          "definition": "Малки (10-100 KB), Гигантски (>128 MB)"
        },
        {
          "concept": "Вид (Kind)",
          "definition": "Документ, Изображение"
        }
      ]
    };
  }
}

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(json, null, 2));
console.log('Updated Task 3 JSON with mode: scattered and concept/definition standard');
