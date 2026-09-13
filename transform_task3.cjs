const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

// find workbook-exercises-section
const workbookSection = data.components.find(c => c.id === 'workbook-exercises-section');
if (workbookSection && workbookSection.items[0]) {
  const tasks = workbookSection.items[0].content;
  const task3Index = tasks.findIndex(t => t.title && t.title.includes('Задача 3'));
  if (task3Index !== -1) {
    tasks[task3Index] = {
      "type": "interactive-matching",
      "id": "wb-task3-matching-win11",
      "title": "Задача 3. Филтри за търсене във File Explorer на Windows 11 (Свържете филтъра с неговите стойности)",
      "pairs": [
        {
          "term": "Време на създаване (Date Modified)",
          "definition": "Днес, Тази седмица"
        },
        {
          "term": "Големина на файла (Size)",
          "definition": "Малки (10-100 KB), Гигантски (>128 MB)"
        },
        {
          "term": "Вид (Kind)",
          "definition": "Документ, Изображение"
        }
      ]
    };
  }
}

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Transformed Task 3 to interactive-matching');
