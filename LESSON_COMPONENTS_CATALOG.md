# Каталог на компоненти, етикети и интерактивни дейности (Lesson Components & Activities Catalog)

Този каталог описва всички налични компоненти, етикети (tags), модални прозорци и интерактивни дейности в учебната платформа. Използвайте този справочник при създаване или редактиране на нови уроци в JSON формат.

---

## 1. Етикети (Tags) и Модали за Дейности

Етикетите (`type: "tag"`) служат за визуално разделяне на секции или като бутони, които отварят модални прозорци (`type: "exercise-modal"`) с подробни инструкции и ресурси.

### А) Етикет „Задача“ (Task Tag)
* **Икона на етикета:** `fas fa-list-check`
* **Тон:** `blue` или `indigo`
* **Вариант:** `task` (иконата е със заоблени ъгли 8px)
* **Пример JSON:**
```json
{
  "type": "tag",
  "id": "task-tag",
  "icon": "fas fa-list-check",
  "text": "Задача",
  "modalTarget": "exerciseModal",
  "tone": "blue",
  "variant": "task",
  "skipNav": true
}
```

### Б) Етикет „Упражнение“ (Exercise Tag)
* **Икона на етикета:** `fas fa-dumbbell`
* **Тон:** `green`
* **Вариант:** `exercise` (по-дебел кант за акцент)
* **Пример JSON:**
```json
{
  "type": "tag",
  "id": "exercise-tag",
  "icon": "fas fa-dumbbell",
  "text": "Упражнение",
  "modalTarget": "exerciseModal",
  "tone": "green",
  "variant": "exercise",
  "skipNav": true
}
```

### В) Етикет „Дискусия“ (Discussion Tag)
* **Икона на етикета:** `fas fa-comments` (със квадратна икона `border-radius: 4px`)
* **Тон:** `purple`
* **Вариант:** `discussion` (лавандулов фон `#f1e8fa`)
* **Пример JSON:**
```json
{
  "type": "tag",
  "id": "discussion-tag-credibility",
  "icon": "fas fa-comments",
  "text": "Дискусия",
  "modalTarget": "discussionModalCredibility",
  "tone": "purple",
  "variant": "discussion",
  "skipNav": true
}
```

### Г) Съответстващ модален прозорец (`exercise-modal`)
Обикновено се поставя непосредствено след съответния tag.
```json
{
  "type": "exercise-modal",
  "id": "discussionModalCredibility",
  "title": "Дискусия: Тема на дискусията",
  "instructions": "<div class='exercise-instructions'><p>Описание на задачата или дискусионните въпроси...</p></div>",
  "resources": [
    {
      "icon": "fa-solid fa-folder-open",
      "label": "Материали към урока",
      "href": "https://drive.google.com/..."
    }
  ]
}
```

---

## 2. Интерактивни дейности и блокове (Interactive Activities)

Тези блокове се вграждат в съдържанието на акордеонните елементи (`content` масива).

### А) Тест с избор на отговор (`quiz`)
```json
{
  "type": "quiz",
  "id": "quiz-block-id",
  "title": "Заглавие на теста",
  "questions": [
    {
      "question": "1. Въпрос текст тук?",
      "options": ["Отговор А", "Отговор Б", "Отговор В"],
      "correctIndex": 0,
      "explanation": "Обяснение за верния отговор."
    }
  ]
}
```

### Б) Свързване на понятия (`interactive-matching` / `match-pairs`)
```json
{
  "type": "interactive-matching",
  "id": "matching-block-id",
  "title": "Свържете понятието с определението",
  "pairs": [
    {
      "concept": "Понятие 1",
      "definition": "Определение за понятие 1"
    },
    {
      "concept": "Понятие 2",
      "definition": "Определение за понятие 2"
    }
  ]
}
```

### В) Попълване на празни места (`interactive-fill`)
```json
{
  "type": "interactive-fill",
  "id": "fill-block-id",
  "title": "Попълнете пропуснатите думи",
  "sentence1": "Тук е изречението с [blank] за попълване.",
  "answer1": "дума"
}
```

### Г) Емоциометър (`emotiometer`)
```json
{
  "type": "emotiometer",
  "id": "reflection-emotiometer",
  "title": "Посочете вашето настроение и енергия"
}
```

### Д) Плъзгач „Преди и След“ (`before-after-slider`)
```json
{
  "type": "before-after-slider",
  "id": "slider-id",
  "title": "Заглавие",
  "beforeLabel": "Етикет Преди",
  "afterLabel": "Етикет След",
  "beforeImage": "assets/...",
  "afterImage": "assets/..."
}
```

### Е) Конструктор на заявки / Sandbox (`query-builder` / `live-search-sandbox`)
```json
{
  "type": "query-builder",
  "id": "query-builder-id",
  "title": "Конструирайте заявката"
}
```
```json
{
  "type": "live-search-sandbox",
  "id": "sandbox-id",
  "title": "Симулатор на търсене"
}
```

---

## 3. Обща структура на урок JSON
Всеки урок се състои от `id`, `slug`, `title`, `grade`, `subject`, `goal`, `layout` и масив от `components` (основни акордеони, етикети и модали).
