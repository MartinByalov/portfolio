const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

const workbookTasksSection = data.components.find(c => c.id === 'workbook-exercises-section');

if (workbookTasksSection) {
  const item = workbookTasksSection.items[0];
  if (item && item.id === 'workbook-tasks-item') {
    item.title = 'Задачи от Учебната Тетрадка';
    item.icon = 'fas fa-list-check';
  }
}

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Updated workbook tasks title and icon');
